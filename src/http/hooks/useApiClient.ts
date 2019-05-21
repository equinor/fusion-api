import useAsyncData from "../../hooks/useAsyncData";
import { useFusionContext } from "../../core/FusionContext";
import ApiClients from "../apiClients";
import { HttpClientError } from "../HttpClient";

export type ApiClientHookResult<T> = [HttpClientError | null, boolean, T | null];

type InvokeApiClient<T> = (apiClients: ApiClients, signal: AbortSignal) => Promise<T>;

export default <T>(invoke: InvokeApiClient<T>, dependencies?: any[]): ApiClientHookResult<T> => {
    const { http } = useFusionContext();

    return useAsyncData(async signal => {
        return await invoke(http.apiClients, signal);
    }, dependencies);
};
