import { useState } from "react";
import useEffectAsync from "../../hooks/useEffectAsync";
import { useFusionContext } from "../../core/FusionContext";
import ApiClients from "../apiClients";
import { HttpClientError } from "../HttpClient";

export type ApiClientHookResult<T> = [HttpClientError | null, boolean, T | null];

type InvokeApiClient<T> = (apiClients: ApiClients) => Promise<T>;

export default <T>(invoke: InvokeApiClient<T>, dependencies?: any[]): ApiClientHookResult<T> => {
    const [error, setError] = useState<HttpClientError | null>(null);
    const [isFeching, setIsFetching] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const fusionContext = useFusionContext();

    useEffectAsync(async () => {
        setIsFetching(true);

        try {
            const result = await invoke(fusionContext.http.apiClients);
            setData(result);
            setError(null);
        } catch (error) {
            setError(error as HttpClientError);
        }

        setIsFetching(false);
    }, dependencies);

    return [error, isFeching, data];
};
