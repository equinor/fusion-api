import { v1 as uuidv1 } from 'uuid';
import { IAuthContainer } from '../../auth/AuthContainer';
import AbortControllerManager from '../../utils/AbortControllerManager';
import IHttpClient, { ResponseParser } from './IHttpClient';
import { HttpResponse } from './HttpResponse';
import ResourceCache from '../ResourceCache';
import {
    HttpClientError,
    HttpClientParseError,
    HttpClientRequestFailedError,
} from './HttpClientError';
import ensureRequestInit from './ensureRequestInit';
import { useFusionContext } from '../../core/FusionContext';
import RequestBody from '../models/RequestBody';
import BlobContainer from '../models/BlobContainer';
import JSON from '../../utils/JSON';
import { TelemetryLogger } from '../../utils/telemetry';
import DistributedState, { IDistributedState } from '../../utils/DistributedState';
import { IEventHub } from '../../utils/EventHub';

// Export interface, response and error types
export {
    IHttpClient,
    HttpResponse,
    HttpClientError,
    HttpClientParseError,
    HttpClientRequestFailedError,
};

type RequestsInProgress = { [key: string]: Promise<HttpResponse<any>> };

export const voidResponseParser = () => Promise.resolve();

const parseHeaders = (input: string): Headers =>
    input
        .trim()
        .split(/[\r\n]+/)
        .reduce((headerMap, line) => {
            const parts = line.split(': ');
            const header = parts.shift();
            const value = parts.join(': ');
            header && headerMap.append(header, value);
            return headerMap;
        }, new Headers());

export default class HttpClient implements IHttpClient {
    private authContainer: IAuthContainer;
    private resourceCache: ResourceCache;
    private abortControllerManager: AbortControllerManager;
    private telemetryLogger: TelemetryLogger;

    private requestsInProgress: IDistributedState<RequestsInProgress>;
    private sessionId = uuidv1();

    constructor(
        authContainer: IAuthContainer,
        resourceCache: ResourceCache,
        abortControllerManager: AbortControllerManager,
        telemetryLogger: TelemetryLogger,
        eventHub: IEventHub
    ) {
        this.authContainer = authContainer;
        this.resourceCache = resourceCache;
        this.abortControllerManager = abortControllerManager;
        this.telemetryLogger = telemetryLogger;
        this.requestsInProgress = new DistributedState<RequestsInProgress>(
            'FusionHttpClient.requestsInProgress',
            {},
            eventHub
        );
    }

    async getAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        // Reuse GET requests in progress
        const requestInProgress = this.getRequestInProgress<TResponse>(url);
        if (requestInProgress) {
            return await requestInProgress;
        }

        return this.performReusableRequest<TResponse>(url, async () => {
            await this.resourceCache.setIsFetchingAsync(url);
            init = ensureRequestInit(init, (init) => ({ ...init, method: 'GET' }));

            const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
            const data = await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
                init,
                response,
                responseParser
            );

            await this.resourceCache.updateAsync(url, data);

            return data;
        });
    }

    async postAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'POST',
            body: this.createRequestBody(body),
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }

    async putAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'PUT',
            body: this.createRequestBody(body),
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }

    async patchAsync<TBody extends RequestBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'PATCH',
            body: this.createRequestBody(body),
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }

    async deleteAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'DELETE',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }

    async optionsAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'OPTIONS',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }
    async headAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null,
        responseParser?: ResponseParser<TResponse>
    ) {
        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'HEAD',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(
            init,
            response,
            responseParser
        );
    }

    async postFormAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        form: FormData,
        onProgress?: (percentage: number, event: ProgressEvent<XMLHttpRequestEventTarget>) => void,
        responseParser?: (response: string) => TResponse
    ): Promise<HttpResponse<TResponse>> {
        const token = await this.authContainer.acquireTokenAsync(url);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentage = Math.round((e.loaded * 100) / e.total);
                        onProgress(percentage, e);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                const response: HttpResponse<TResponse> = {
                    data: responseParser
                        ? responseParser(xhr.responseText)
                        : JSON.parse<TResponse>(xhr.responseText),
                    status: xhr.status,
                    headers: parseHeaders(xhr.getAllResponseHeaders()),
                    refreshRequest: null,
                };
                resolve(response);
            });

            xhr.upload.addEventListener('error', () => {
                const response = xhr.responseText;
                const headers = parseHeaders(xhr.getAllResponseHeaders());
                if (response) {
                    const errorResponse = JSON.parse<TExpectedErrorResponse>(response);
                    reject(
                        new HttpClientRequestFailedError(url, xhr.status, errorResponse, headers)
                    );
                }
                reject(new HttpClientRequestFailedError(url, xhr.status, null, headers));
            });

            xhr.open('POST', url, true);

            xhr.setRequestHeader('X-Session-Id', this.sessionId);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('x-pp-refresh', 'true');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);

            xhr.send(form);
        });
    }

    async getBlobAsync<TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null
    ): Promise<BlobContainer> {
        if (!init) {
            init = {
                headers: new Headers({ Accept: '*/*' }),
            };
        }

        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'GET',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        const blob = await response.blob();

        const fileName = this.resolveFileNameFromHeader(response);

        if (!fileName) {
            throw new Error('Cannot download file without filename');
        }

        return { blob, fileName };
    }

    async getFileAsync<TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null
    ): Promise<File> {
        if (!init) {
            init = {
                headers: new Headers({ Accept: '*/*' }),
            };
        }

        init = ensureRequestInit(init, (init) => ({
            ...init,
            method: 'GET',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        const blob = await response.blob();

        const fileName = this.resolveFileNameFromHeader(response);

        if (!fileName) {
            throw new Error('Cannot download file without filename');
        }

        return new File([blob], fileName);
    }

    async uploadFileAsync<TExpectedErrorResponse>(
        url: string,
        file: File,
        method: 'PUT' | 'PATCH' | 'POST',
        init?: RequestInit | null
    ): Promise<Response> {
        const body = new FormData();
        body.append('file', file);

        const requestInit = ensureRequestInit(
            {
                ...init,
                method,
                body,
            },
            (input) => {
                (input.headers as Headers).delete('Content-Type');
                return input;
            }
        );
        return this.performFetchAsync<TExpectedErrorResponse>(url, requestInit);
    }

    protected responseIsRetriable(response: Response, retryTimeout: number) {
        if (retryTimeout > 20000 || response.headers.get('x-fusion-retriable') === 'false') {
            return false;
        }

        return (
            response.status === 408 ||
            response.status === 424 ||
            (response.status === 500 && response.headers.get('x-fusion-retriable') === 'true') ||
            response.status === 502 ||
            response.status === 503 ||
            response.status === 504
        );
    }

    protected async retryRequestAsync<TExpectedErrorResponse>(
        url: string,
        init: RequestInit,
        retryTimeout: number
    ): Promise<Response> {
        // Wait before retrying the request
        await new Promise((resolve) => setTimeout(resolve, retryTimeout));

        // Abort the request if the signal has been aborted while waiting
        if (this.abortControllerManager.getCurrentSignal()?.aborted) {
            throw new Error(`Request ${init.method} ${url} was aborted`);
        }

        return this.performFetchAsync<TExpectedErrorResponse>(url, init, retryTimeout + 3000);
    }

    private async performFetchAsync<TExpectedErrorResponse>(
        url: string,
        init: RequestInit,
        retryTimeout = 3000
    ): Promise<Response> {
        try {
            const options = await this.transformRequestAsync(url, init);

            const response = await fetch(url, options);

            if (!response.ok) {
                if (this.responseIsRetriable(response, retryTimeout)) {
                    return this.retryRequestAsync<TExpectedErrorResponse>(url, init, retryTimeout);
                }

                // Add more info
                const errorResponse = await this.parseResponseJSONAsync<TExpectedErrorResponse>(
                    response
                );

                throw new HttpClientRequestFailedError(
                    url,
                    response.status,
                    errorResponse,
                    response.headers
                );
            }

            return response;
        } catch (error) {
            if (error instanceof HttpClientRequestFailedError) {
                // TODO: Add to notification center?
                // TODO: Update cache status?
                throw error;
            }

            this.telemetryLogger.trackException({ exception: error as Error });

            // Add more info
            throw error as HttpClientError;
        }
    }

    private async performReusableRequest<TResponse>(
        url: string,
        handler: () => Promise<HttpResponse<TResponse>>
    ) {
        // Reuse GET requests in progress
        const requestInProgress = this.getRequestInProgress<TResponse>(url);
        if (requestInProgress) {
            return await requestInProgress;
        }

        const requestPerformer = async () => {
            try {
                const data = await handler();
                const requestsInProgres = this.requestsInProgress.state;
                delete requestsInProgres[url];
                this.requestsInProgress.state = { ...requestsInProgres };
                return data;
            } catch (error) {
                const requestsInProgres = this.requestsInProgress.state;
                delete requestsInProgres[url];
                this.requestsInProgress.state = { ...requestsInProgres };
                throw error;
            }
        };

        const request = requestPerformer();

        this.requestsInProgress.state = { ...this.requestsInProgress.state, [url]: request };

        return await request;
    }

    // Response parsers
    private async parseResponseJSONAsync<TResponse>(response: Response) {
        try {
            const text = await response.text();
            const json = text ? JSON.parse<TResponse>(text) : null;
            return json;
        } catch (parseError) {
            // Add more info
            throw new HttpClientParseError(response);
        }
    }

    private async parseResponseAsync<TResponse, TExpectedErrorResponse>(
        request: RequestInit,
        response: Response,
        responseParser?: ResponseParser<TResponse>
    ): Promise<HttpResponse<TResponse>> {
        const data = responseParser
            ? await responseParser(response)
            : await this.parseResponseJSONAsync<TResponse>(response);
        // TODO: Update cache status?

        // TODO: response should hint of null or throw empty response error, too big for current fix scope
        return this.createHttpResponse<TResponse, TExpectedErrorResponse>(
            request,
            response,
            data as TResponse
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private createHttpResponse<TResponse, TExpectedErrorResponse>(
        request: RequestInit,
        response: Response,
        data: TResponse
    ) {
        const httpResponse: HttpResponse<TResponse> = {
            data,
            status: response.status,
            headers: response.headers,
            refreshRequest: null,
        };

        if (this.responseIsRefreshable(response)) {
            const refreshRequest = this.addRefreshHeader(request);

            return {
                ...httpResponse,
                refreshRequest,
            };
        }

        return httpResponse;
    }

    private responseIsRefreshable(response: Response) {
        return response.headers.get('x-pp-is-refreshable') !== null;
    }

    // Request transformers
    private async transformRequestAsync(url: string, init: RequestInit) {
        const requestWithSessionId = this.addSessionIdHeader(init);
        const requestWithAcceptJson = this.addAcceptJsonHeader(requestWithSessionId);
        const requestWithAuthToken = await this.addAuthHeaderAsync(url, requestWithAcceptJson);
        const requestWithAbortSignal = this.addAbortSignal(requestWithAuthToken);

        return requestWithAbortSignal;
    }

    private addSessionIdHeader(init: RequestInit) {
        return this.transformHeaders(init, (headers) =>
            headers.append('X-Session-Id', this.sessionId)
        );
    }

    private addAcceptJsonHeader(init: RequestInit) {
        return this.transformHeaders(init, (headers) =>
            headers.append('Accept', 'application/json')
        );
    }

    private addRefreshHeader(init: RequestInit) {
        return this.transformHeaders(init, (headers) => headers.append('x-pp-refresh', 'true'));
    }

    private async addAuthHeaderAsync(url: string, init: RequestInit) {
        const token = await this.authContainer.acquireTokenAsync(url);
        return this.transformHeaders(init, (headers) =>
            headers.append('Authorization', 'Bearer ' + token)
        );
    }

    private addAbortSignal(init: RequestInit) {
        const signal = this.abortControllerManager.getCurrentSignal();

        if (signal !== null) {
            init.signal = signal;
        }

        return init;
    }

    private transformHeaders(
        init: RequestInit,
        transform: (headers: Headers) => void
    ): RequestInit {
        const headers = new Headers(init.headers);
        transform(headers);

        return {
            ...init,
            headers,
        };
    }

    // Utils
    private getRequestInProgress<T>(url: string) {
        return this.requestsInProgress.state[url] as Promise<HttpResponse<T>>;
    }

    private createRequestBody<TBody extends RequestBody>(body: TBody) {
        if (typeof body === 'function') {
            const bodyFactory = body as () => string;
            return bodyFactory();
        }

        return JSON.stringify(body);
    }

    private resolveFileNameFromHeader(response: Response): string | null {
        const contentDisposition = response.headers.get('Content-Disposition');

        if (!contentDisposition) return null;

        const parts = contentDisposition.split(';');
        const fileNamePart = parts.find((part) => part.indexOf('filename=') !== -1);

        if (!fileNamePart) return null;

        const fileName = fileNamePart.split('=')[1];

        // The API returns filename wrapped in double qutoes to preserve spaces.
        // These should be replaced when parsing the filename to prevent the browser
        // from prefixing and postfixing the filname with underscores during download.

        // If we do not replace the quotes, the parsed filename would be a double quoted
        // string (e.g. ""file.pdf""). The browser would likely create the following
        // filename when the file is downloaded: _file.pdf_. This would result in the
        // client not recognising the file format and the user will not be able to open
        // the file.
        return fileName.replace(/["]/g, '');
    }
}

export const useHttpClient = () => {
    const { http } = useFusionContext();
    return http.client;
};
