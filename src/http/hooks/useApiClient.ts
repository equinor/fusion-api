import useAsyncData from "../../hooks/useAsyncData";
import useApiClients from "./useApiClients";
import ApiClients from "../apiClients";
import { HttpClientError } from "../HttpClient";

export type ApiClientHookResult<T> = [HttpClientError | null, boolean, T | null];

type InvokeApiClient<T> = (apiClients: ApiClients, signal: AbortSignal) => Promise<T>;

export default <T>(invoke: InvokeApiClient<T>, dependencies?: any[]): ApiClientHookResult<T> => {
    const apiClients = useApiClients();

    return useAsyncData(async signal => {
        return await invoke(apiClients, signal);
    }, dependencies);
};
