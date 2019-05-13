import { useState } from "react";
import useEffectAsync from "../../hooks/useEffectAsync";
import { useFusionContext } from "../../core/FusionContext";
import ApiClients from "../apiClients";
import { HttpClientError } from "../HttpClient";

type InvokeApiClient<T> = (apiClients: ApiClients) => Promise<T>;

export default <T>(invoke: InvokeApiClient<T>, dependencies?: any[]): [HttpClientError | null, boolean, T | null] => {
    const [error, setError] = useState<HttpClientError | null>(null);
    const [isFeching, setIsFetching] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const fusionContext = useFusionContext();

    useEffectAsync(async () => {
        setIsFetching(true);

        try {
            const result = await invoke(fusionContext.http.apiClients);
            setData(result);
        } catch (error) {
            setError(error as HttpClientError);
        }

        setIsFetching(false);
    }, dependencies);

    return [error, isFeching, data];
};
