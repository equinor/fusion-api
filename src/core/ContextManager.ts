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

type ContextCache = {
    current: Context | null;
    history: Context[] | null;
    links: { [key: string]: string };
};

export default class ContextManager extends ReliableDictionary<ContextCache> {
    private readonly contextClient: ContextClient;
    private isSettingFromRoute: boolean = false;
    private history: History;

    constructor(apiClients: ApiClients, private appContainer: AppContainer, history: History) {
        super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`, new EventHub()));
        this.contextClient = apiClients.context;
        this.history = history;

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
        const contextId =
            getContextFromUrl && this.history.location && this.history.location.pathname
                ? getContextFromUrl(this.history.location.pathname.replace(appPath, ''))
                : null;

        const hasAppPath = this.history.location.pathname.indexOf(appPath) !== -1;
        if (contextId) return this.setCurrentContextFromIdAsync(contextId);

        const currentContext = await this.getCurrentContextAsync();
        if (buildUrl && currentContext)
            this.history.push(combineUrls(hasAppPath ? appPath : '', buildUrl(currentContext)));
    }

    async setCurrentContextAsync(context: Context) {
        const currentContext = await this.getCurrentContextAsync();
        const buildUrl = this.appContainer.currentApp?.context?.buildUrl;

        const appPath = `/apps/${this.appContainer.currentApp?.key}`;
        const hasAppPath = this.history.location.pathname.indexOf(appPath) !== -1;

        if (buildUrl && context)
            this.history.push(combineUrls(hasAppPath ? appPath : '', buildUrl(context)));

        await this.setAsync('current', context);

        if (!currentContext) {
            return;
        }

        this.updateHistoryAsync(currentContext);
        this.updateLinksAsync(currentContext, context);
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

        const response = await this.contextClient.getContextAsync(linkedContextId);

        return response.data || null;
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

        const contextResponse = await this.contextClient.getContextAsync(currentContext.id);
        return contextResponse.data;
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

    const setContext = useCallback((contextCache: ContextCache) => {
        if (contextCache.current !== currentContext) {
            setCurrentContext(contextCache.current);
        }
    }, []);

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
