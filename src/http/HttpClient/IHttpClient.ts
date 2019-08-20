import { HttpResponse } from './HttpResponse';
import RequestBody from '../models/RequestBody';

export type ResponseParser<T> = (response: Response) => Promise<T>;

export default interface IHttpClient {
    /**
     * Perform a GET request
     * @param url Request url
     * @param init Optional request init object
     */
    getAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a POST request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    postAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a PUT request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    putAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a PATCH request
     * @param url Request url
     * @param body Request body (will be serialized as JSON)
     * @param init Optional request init object
     */
    patchAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;
}
