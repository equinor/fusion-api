import { useState, useCallback, useEffect } from 'react';
import ApiClients from '../http/apiClients';
import ContextClient from '../http/apiClients/ContextClient';
import { useFusionContext } from './FusionContext';
import { Context, ContextTypes } from '../http/apiClients/models/context';
import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';
import useDebouncedAbortable from '../hooks/useDebouncedAbortable';
import useApiClients from '../http/hooks/useApiClients';
import EventHub from '../utils/EventHub';
import AppContainer, { useCurrentApp } from '../app/AppContainer';
import AppManifest from '../http/apiClients/models/fusion/apps/AppManifest';
import { History } from 'history';
import { combineUrls } from '../utils/url';
import FeatureLogger from '../utils/FeatureLogger';
import { TelemetryLogger } from '../utils/telemetry';

type ContextCache = {
    current: Context | null;
    history: Context[] | null;
    links: { [key: string]: string };
};

export default class ContextManager extends ReliableDictionary<ContextCache> {
    private readonly contextClient: ContextClient;
    private isSettingFromRoute = false;

    constructor(
        apiClients: ApiClients,
        private appContainer: AppContainer,
        private featureLogger: FeatureLogger,
        private telemetryLogger: TelemetryLogger,
        private history: History
    ) {
        super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`, new EventHub()));
        this.contextClient = apiClients.context;

        // resolve context when the browser location changes
        this.history.listen(() => this.resolveContextFromUrl());

        /**
         * bootstrap
         * after first app is loaded, the context is resolved, since the app contains the method for
         * resolving the context from the location path
         */
        const unlistenAppContainer = this.appContainer.on('change', (app) => {
            this.resolveContextFromUrl(app);
            unlistenAppContainer();
        });
    }

    private appHasContext = (): boolean => Boolean(this.appContainer.currentApp?.context);

    private getAppPath = () => `/apps/${this.appContainer.currentApp?.key}`;

    private urlHasPath = (path: string): boolean => !!path.match(/^[/]?apps/);

    private getScopedPath = (path: string): string =>
        this.history.location.pathname.replace(path, '');

    private buildUrlWithContext = async (context: Context) => {
        const buildUrl = this.appContainer.currentApp?.context?.buildUrl;

        if (!buildUrl || !context.id) {
            return null;
        }

        const path = this.history.location.pathname;
        const appPath = this.getAppPath();
        const cgi = window.location.search;
        const newUrl = combineUrls(
            this.urlHasPath(path) ? appPath : '',
            buildUrl(context, this.getScopedPath(appPath) + cgi)
        );

        return newUrl;
    };

    private updateContextLocation = async (context: Context) => {
        const newUrl = await this.buildUrlWithContext(context);
        const oldUrl = this.history.location.pathname + this.history.location.search;
        if (newUrl && newUrl !== oldUrl) {
            this.history.replace(newUrl);
        }
    };

    private ensureCurrentContextExistsInUrl = async () => {
        if (!this.appHasContext()) return;
        const context = await this.getCurrentContextAsync();
        context && this.updateContextLocation(context);
    };

    private async resolveContextFromUrl(app?: AppManifest | null) {
        app ??= this.appContainer.currentApp;
        if (!app || !app.context) return;

        const getContextFromUrl = app.context.getContextFromUrl;

        const contextId =
            getContextFromUrl && this.history.location && this.history.location.pathname
                ? getContextFromUrl(this.getScopedPath(this.getAppPath()))
                : null;

        if (contextId) {
            await this.setCurrentContextFromIdAsync(contextId);
        }
    }

    private async validateContext(context: Context | null) {
        if (!context) return;

        try {
            const validContext = await this.contextClient.getContextAsync(context.id);
            if (validContext?.data) {
                this.featureLogger.setCurrentContext(context.id, context.title);

                const history = await this.getAsync('history');
                this.featureLogger.log('Context selected', '0.0.1', {
                    selectedContext: context
                        ? {
                              id: context.id,
                              name: context.title,
                          }
                        : null,
                    previusContexts: (history || []).map((c) => ({ id: c.id, name: c.title })),
                });

                this.telemetryLogger.trackEvent({
                    name: 'Project selected',
                    properties: {
                        projectId: context.id,
                        projectName: context.title,
                        currentApp: this.appContainer.currentApp?.name,
                    },
                });

                return;
            }

            await this.setAsync('current', null);
            this.featureLogger.setCurrentContext(null, null);
        } catch {
            await this.setAsync('current', null);
            this.featureLogger.setCurrentContext(null, null);
        }
    }

    async setCurrentContextAsync(context: Context | null) {
        const currentContext = await this.getAsync('current');

        if (currentContext?.id === context?.id) {
            return this.ensureCurrentContextExistsInUrl();
        }

        if (context && this.appHasContext()) {
            await this.updateContextLocation(context);
        }

        await this.setAsync('current', context);
        this.validateContext(context);

        if (!currentContext) {
            return;
        }
        try {
            const previousContext = await this.contextClient.getContextAsync(currentContext.id);
            if (!previousContext) return;

            this.updateHistoryAsync(previousContext.data);
            if (context) this.updateLinksAsync(previousContext.data, context);
        } catch {
            return;
        }
    }

    async setCurrentContextIdAsync(id: string | null) {
        if (!id) {
            return await this.setCurrentContextAsync(null);
        }

        try {
            const response = await this.contextClient.getContextAsync(id);
            await this.setCurrentContextAsync(response.data);
        } catch (e) {
            this.telemetryLogger.trackException(e);
            await this.setCurrentContextAsync(null);
        }
    }

    private async updateHistoryAsync(currentContext: Context) {
        const newHistory = [currentContext];

        const history = await this.getAsync('history');
        if (history) {
            debugger;
            history
                // Remove the current context from the previous history (it's added to the start of the history)
                .filter((c) => c.id !== currentContext.id)
                // Remove historical contexts after the last 10 (currentContext + 9)
                .slice(0, 9)
                .forEach((c) => newHistory.push(c));
        }

        await this.setAsync('history', newHistory);
    }

    private async updateLinksAsync(currentContext: Context, newContext: Context) {
        const links = await this.getAsync('links');

        await this.setAsync('links', {
            ...(links || {}),
            [currentContext.id]: newContext.id,
        });
    }

    async getLinkedContextAsync(context: Context) {
        const links = await this.getAsync('links');

        if (!links || !links[context.id]) {
            return null;
        }

        const linkedContextId = links[context.id];

        const history = await this.getAsync('history');
        const contextFromHistory = history ? history.find((c) => c.id === linkedContextId) : null;

        if (contextFromHistory) {
            return contextFromHistory;
        }

        try {
            const response = await this.contextClient.getContextAsync(linkedContextId);
            return response.data || null;
        } catch {
            return null;
        }
    }

    getCurrentContext() {
        // Avoid returning cached context if we're in the process of resolving a context from the current route
        if (this.isSettingFromRoute) {
            return null;
        }

        const value = this.toObject();
        return value ? value.current : null;
    }

    getHistory(): Context[] {
        const value = this.toObject();
        return value?.history || [];
    }

    async getCurrentContextAsync(resolve = true): Promise<Context | null> {
        // Avoid returning cached context if we're in the process of resolving a context from the current route
        if (this.isSettingFromRoute) {
            return null;
        }

        const currentContext = await this.getAsync('current');

        if (!currentContext) {
            if (resolve) {
                console.log('ok');
                const { currentApp } = this.appContainer;
                await this.resolveContextFromUrl(currentApp);
                return this.getCurrentContextAsync(false);
            }
            return null;
        }

        try {
            const contextResponse = await this.contextClient.getContextAsync(currentContext.id);
            return contextResponse.data;
        } catch {
            return null;
        }
    }

    async exchangeContextAsync(currentContext: Context, ...requiredTypes: ContextTypes[]) {
        try {
            const result = await this.contextClient.getRelatedContexts(
                currentContext.id,
                ...requiredTypes
            );
            return result.data;
        } catch {
            return [];
        }
    }

    async exchangeCurrentContextAsync(...requiredType: ContextTypes[]) {
        const currentContext = await this.getCurrentContextAsync();

        if (currentContext === null) {
            return [];
        }

        return await this.exchangeContextAsync(currentContext, ...requiredType);
    }

    private async setCurrentContextFromIdAsync(contextId: string) {
        this.isSettingFromRoute = true;

        try {
            const response = await this.contextClient.getContextAsync(contextId);
            const context = response.data;

            if (context) {
                this.isSettingFromRoute = false;
                await this.setCurrentContextAsync(context);
            }
        } catch {
            this.isSettingFromRoute = false;
        }
    }
}

const useContextManager = () => {
    const fusionContext = useFusionContext();
    return fusionContext.contextManager;
};

const useCurrentContextTypes = () => {
    const app = useCurrentApp();
    return app && app.context ? app.context.types : [];
};

const filterContextByContextType = (validContextTypes: ContextTypes[], contexts: Context[]) =>
    contexts.filter((context) => validContextTypes.includes(context.type.id));

const useContextHistory = () => {
    const contextManager = useContextManager();
    const validContextTypes = useCurrentContextTypes();
    const [history, setHistory] = useState<Context[]>(
        filterContextByContextType(validContextTypes, contextManager.getHistory())
    );

    const setHistoryFromCache = useCallback(
        (contextCache: ContextCache) => {
            if (contextCache.history !== history) {
                setHistory(
                    filterContextByContextType(validContextTypes, contextCache.history || [])
                );
            }
        },
        [validContextTypes]
    );

    useEffect(() => {
        contextManager.toObjectAsync().then(setHistoryFromCache);
        return contextManager.on('change', setHistoryFromCache);
    }, []);

    return history;
};

const useCurrentContext = () => {
    const contextManager = useContextManager();
    const [currentContext, setCurrentContext] = useState(contextManager.getCurrentContext());

    const setContext = useCallback(
        (contextCache: ContextCache) => {
            if (contextCache.current !== currentContext) {
                setCurrentContext(contextCache.current);
            }
        },
        [currentContext]
    );

    useEffect(() => {
        contextManager.toObjectAsync().then(setContext);

        return contextManager.on('change', setContext);
    }, []);

    return currentContext || null;
};

const useContextQuery = (): {
    error: Error | null;
    isQuerying: boolean;
    contexts: Context[];
    search: (query: string) => void;
} => {
    const [contexts, setContexts] = useState<Context[]>([]);
    const [queryText, setQueryText] = useState('');
    const [isQuerying, setIsQuerying] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const apiClients = useApiClients();
    const currentTypes = useCurrentContextTypes();
    const filterContexts = useCurrentApp()?.context?.filterContexts;

    const canQueryWithText = (text: string) => !!text && text.length > 2;

    const fetchContexts = useCallback(
        async (query: string) => {
            if (canQueryWithText(query)) {
                setContexts([]);
                try {
                    const response = await apiClients.context.queryContextsAsync(
                        query,
                        ...currentTypes
                    );
                    setContexts(filterContexts?.(response.data) || response.data);
                    setIsQuerying(false);
                } catch (e) {
                    setError(e);
                    setContexts([]);
                    setIsQuerying(false);
                }
            }
        },
        [currentTypes, filterContexts]
    );

    useDebouncedAbortable(fetchContexts, queryText);

    const search = (query: string) => {
        setIsQuerying(canQueryWithText(query));
        setQueryText(query);
    };
    return { error, isQuerying, contexts, search };
};

export {
    useContextManager,
    useCurrentContext,
    useContextQuery,
    useCurrentContextTypes,
    useContextHistory,
};
