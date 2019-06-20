import { useState, useCallback, useEffect } from "react";
import ApiClients from "../http/apiClients";
import ContextClient from "../http/apiClients/ContextClient";
import { useFusionContext } from "./FusionContext";
import { Context, ContextTypes } from "../http/apiClients/models/context";
import ReliableDictionary, { LocalStorageProvider } from "../utils/ReliableDictionary";
import useDebouncedAbortable from "../hooks/useDebouncedAbortable";
import useApiClients from "../http/hooks/useApiClients";

type ContextCache = {
    current: Context | null;
    history: Context[] | null;
};

export default class ContextManager extends ReliableDictionary<ContextCache> {
    private readonly contextClient: ContextClient;
    private isSettingFromRoute: boolean = false;

    constructor(apiClients: ApiClients, contextId: string | null) {
        super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`));
        this.contextClient = apiClients.context;

        if (contextId) {
            this.setCurrentContextFromIdAsync(contextId);
        }
    }

    async setCurrentContextAsync(context: Context) {
        const currentContext = await this.getCurrentContextAsync();
        const history = await this.getAsync("history");

        await this.setAsync("current", context);

        if (!currentContext) {
            return;
        }

        const newHistory = [currentContext];

        if (history) {
            history
                // Remove the current context from the previous history (it's added to the start of the history)
                .filter(c => c.id !== currentContext.id)
                // Remove historical contexts after the last 10 (currentContext + 9)
                .slice(0, 9)
                .forEach(c => newHistory.push(c));
        }

        await this.setAsync("history", newHistory);
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

        const currentContext = await this.getAsync("current");

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

        return contextManager.on("change", setHistoryFromCache);
    }, []);

    return history;
};

const useCurrentContext = (...types: ContextTypes[]): Context | null => {
    const contextManager = useContextManager();
    const [currentContext, setCurrentContext] = useState(contextManager.getCurrentContext());

    const setContext = useCallback((contextCache: ContextCache) => {
        if (contextCache.current !== currentContext) {
            setCurrentContext(contextCache.current);
        }
    }, []);

    useEffect(() => {
        contextManager.toObjectAsync().then(setContext);

        return contextManager.on("change", setContext);
    }, []);

    const history = useContextHistory();
    if (
        currentContext &&
        types.length > 0 &&
        !types.find(type => currentContext.type.id === type)
    ) {
        return null;
    }

    // We don't have a context at all, but we could try to find the first context in the history
    // that matches the given types (if any)
    if (!currentContext && types.length > 0 && history.length > 0) {
        const historicalContext =
            history.find(c => types.findIndex(type => c.type.id === type) > 0) || null;

        if (historicalContext) {
            contextManager.setCurrentContextAsync(historicalContext);
            return historicalContext;
        }
    }

    return currentContext || null;
};

const useContextQuery = (
    ...types: ContextTypes[]
): [Error | null, boolean, Context[], (query: string) => void] => {
    const [contexts, setContexts] = useState<Context[]>([]);
    const [queryText, setQueryText] = useState("");
    const [isQuerying, setIsQuerying] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const apiClients = useApiClients();

    const fetchContexts = useCallback(async (query: string) => {
        if (query && query.length > 2) {
            setIsQuerying(true);
            try {
                var response = await apiClients.context.queryContextsAsync(query, ...types);
                setContexts(response.data);
                setIsQuerying(false);
            } catch (e) {
                setError(e);
                setIsQuerying(false);
            }
        }
    }, []);

    useDebouncedAbortable(fetchContexts, queryText);

    const search = (query: string) => {
        setQueryText(query);
    };

    return [error, isQuerying, contexts, search];
};

export { useContextManager, useCurrentContext, useContextQuery };
