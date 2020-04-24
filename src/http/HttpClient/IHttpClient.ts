import { HttpResponse } from './HttpResponse';
import RequestBody from '../models/RequestBody';
import BlobContainer from '../models/BlobContainer';

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

    /**
     * Perform a DELETE request
     * @param url Request url
     * @param init Optional request init object
     * @param responseParser Optional response parser
     */
    deleteAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;

    /**
     * Perform a OPTIONS request
     * @param url Request url
     * @param init Optional request init object
     */
    optionsAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>>;

    /**
     *  Performs a POST with multipart form data
     * @param url Request url
     * @param form Optional request init object
     * @param onProgress Callback for progress updates
     * @param responseParser Optional custom response parser
     */
    postFormAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        form: FormData,
        onProgress?: (percentage: number, event: ProgressEvent<XMLHttpRequestEventTarget>) => void,
        responseParser?: (response: string) => TResponse
    ): Promise<HttpResponse<TResponse>>;

    /**
     *  Performs a GET request and converts the response to a Blob
     * @param url Request url
     */
    getBlobAsync<TExpectedErrorResponse>(url: string): Promise<BlobContainer>;

    /**
    *  Performs a GET request and converts the response to a File
    * @param url Request url
    */
    getFileAsync<TExpectedErrorResponse>(url: string): Promise<File>;
}
