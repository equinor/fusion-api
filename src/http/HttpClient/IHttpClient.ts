import { HttpResponse } from "./HttpResponse";

export default interface IHttpClient {
    /**
     * Perform a GET request
     * @param url Request url
     * @param init Optional request init object
     */
    getAsync<T, TExpectedErrorResponse>(url: string, init?: RequestInit): Promise<HttpResponse<T>>;

    getStringAsync<TExpectedErrorResponse>(url: string, init?: RequestInit): Promise<HttpResponse<string>>;

    /**
     * Perform a POST request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    postAsync<TBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a PUT request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    putAsync<TBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a PATCH request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    patchAsync<TBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit
    ): Promise<HttpResponse<TResponse>>;
}
