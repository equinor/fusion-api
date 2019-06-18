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
    previous: Context | null;
};

export default class ContextManager extends ReliableDictionary<ContextCache> {
    private readonly contextClient: ContextClient;

    constructor(apiClients: ApiClients) {
        super(new LocalStorageProvider(`FUSION_CURRENT_CONTEXT`));
        this.contextClient = apiClients.context;
    }

    async setCurrentContextAsync(context: Context): Promise<void> {
        const currentContext = await this.getCurrentContextAsync();

        await this.setAsync("current", context);
        await this.setAsync("previous", currentContext);
    }

    getCurrentContext() {
        const value = this.toObject();
        return value !== null ? value.current : null;
    }

    async getCurrentContextAsync() {
        const value = await this.toObjectAsync();

        if(value === null || !value.current) {
            return null;
        }

        const contextResponse = await this.contextClient.getContextAsync(value.current.id);
        return contextResponse.data;
    }

    async exchangeContextAsync(currentContext: Context, requiredType: ContextTypes) {
        try {
            const result = await this.contextClient.getRelatedContexts(
                currentContext.id,
                requiredType
            );
            return result.data;
        } catch {
            return [];
        }
    }

    async exchangeCurrentContextAsync(requiredType: ContextTypes) {
        const currentContext = await this.getCurrentContextAsync();

        if (currentContext === null) {
            return [];
        }

        return await this.exchangeContextAsync(currentContext, requiredType);
    }
}

const useContextManager = () => {
    const fusionContext = useFusionContext();
    return fusionContext.contextManager;
};

const useCurrentContext = (type?: ContextTypes) => {
    const contextManager = useContextManager();
    const [currentContext, setCurrentContext] = useState(contextManager.getCurrentContext());

    const setContext = useCallback((contextCache: ContextCache) => {
        if (contextCache.current !== currentContext) {
            setCurrentContext(contextCache.current as Context);
        }
    }, []);

    useEffect(() => {
        contextManager.toObjectAsync().then(setContext);

        return contextManager.on("change", setContext);
    }, []);

    if(type && currentContext && currentContext.type.id !== type) {
        return null;
    }

    return currentContext;
};

const useContextQuery = (type: ContextTypes): [Error | null, boolean, Context[], (query: string) => void] => {
    const [contexts, setContexts] = useState<Context[]>([]);
    const [queryText, setQueryText] = useState("");
    const [isQuerying, setIsQuerying] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const apiClients = useApiClients();

    const fetchContexts = useCallback(async (query: string) => {
        if(query && query.length > 2) {
            try {
                var response = await apiClients.context.queryContextsAsync(query, type);
                setContexts(response.data);
                setIsQuerying(false);
            } catch(e) {
                setError(e);
                setIsQuerying(false);
            }
        }
    }, []);

    useDebouncedAbortable(fetchContexts, queryText);

    const search = (query: string) => {
        setIsQuerying(true);
        setQueryText(query);
    };

    return [error, isQuerying, contexts, search];
};

export { useContextManager, useCurrentContext, useContextQuery };
