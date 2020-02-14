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

type ContextCache = {
    current: Context | null;
    history: Context[] | null;
    links: { [key: string]: string };
};

export default class ContextManager extends ReliableDictionary<ContextCache> {
    private readonly contextClient: ContextClient;
    private isSettingFromRoute: boolean = false;

    constructor(
        apiClients: ApiClients,
        private appContainer: AppContainer,
        private featureLogger: FeatureLogger,
        private history: History
    ) {
        super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`, new EventHub()));
        this.contextClient = apiClients.context;

        const unlistenAppContainer = this.appContainer.on('change', app => {
            this.resolveContextFromUrlOrLocalStorageAsync(app);
            unlistenAppContainer();
        });
    }

    private async resolveContextFromUrlOrLocalStorageAsync(app: AppManifest | null) {
        if (!app || !app.context) return;

        const {
            context: { getContextFromUrl, buildUrl },
        } = app;

        const appPath = `/apps/${app.key}`;
        const scopedPath = this.history.location.pathname.replace(appPath, '');
        const contextId =
            getContextFromUrl && this.history.location && this.history.location.pathname
                ? getContextFromUrl(scopedPath)
                : null;

        const hasAppPath = this.history.location.pathname.indexOf(appPath) !== -1;
        if (contextId) return this.setCurrentContextFromIdAsync(contextId);

        const currentContext = await this.getCurrentContextAsync();
        if (buildUrl && currentContext) {
            const newUrl = combineUrls(
                hasAppPath ? appPath : '',
                buildUrl(currentContext, scopedPath)
            );
            if (this.history.location.pathname.indexOf(newUrl) !== 0) this.history.push(newUrl);
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
                    previusContexts: (history || []).map(c => ({ id: c.id, name: c.title })),
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
        const buildUrl = this.appContainer.currentApp?.context?.buildUrl;
        const currentContext = await this.getAsync('current');

        const appPath = `/apps/${this.appContainer.currentApp?.key}`;
        const hasAppPath = this.history.location.pathname.indexOf(appPath) !== -1;
        const scopedPath = this.history.location.pathname.replace(appPath, '');

        if (buildUrl)
            this.history.push(
                combineUrls(hasAppPath ? appPath : '', buildUrl(context, scopedPath))
            );

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

    private async updateHistoryAsync(currentContext: Context) {
        const newHistory = [currentContext];

        const history = await this.getAsync('history');
        if (history) {
            history
                // Remove the current context from the previous history (it's added to the start of the history)
                .filter(c => c.id !== currentContext.id)
                // Remove historical contexts after the last 10 (currentContext + 9)
                .slice(0, 9)
                .forEach(c => newHistory.push(c));
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
        const contextFromHistory = history ? history.find(c => c.id === linkedContextId) : null;

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
        return value && value.history ? value.history : [];
    }

    async getCurrentContextAsync() {
        // Avoid returning cached context if we're in the process of resolving a context from the current route
        if (this.isSettingFromRoute) {
            return null;
        }

        const currentContext = await this.getAsync('current');

        if (!currentContext) {
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

const useContextHistory = () => {
    const contextManager = useContextManager();
    const [history, setHistory] = useState<Context[]>(contextManager.getHistory());

    const setHistoryFromCache = useCallback((contextCache: ContextCache) => {
        if (contextCache.history !== history) {
            setHistory(contextCache.history || []);
        }
    }, []);

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

    const canQueryWithText = (text: string) => !!text && text.length > 2;

    const fetchContexts = useCallback(async (query: string) => {
        if (canQueryWithText(query)) {
            setContexts([]);
            try {
                var response = await apiClients.context.queryContextsAsync(query, ...currentTypes);
                setContexts(response.data);
                setIsQuerying(false);
            } catch (e) {
                setError(e);
                setContexts([]);
                setIsQuerying(false);
            }
        }
    }, []);

    useDebouncedAbortable(fetchContexts, queryText);

    const search = (query: string) => {
        setIsQuerying(canQueryWithText(query));
        setQueryText(query);
    };
    return { error, isQuerying, contexts, search };
};

export { useContextManager, useCurrentContext, useContextQuery, useCurrentContextTypes };
