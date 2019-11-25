import uuid from 'uuid/v1';
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
import JSON from '../../utils/JSON';
import TelemetryLogger from '../../utils/TelemetryLogger';

// Export interface, response and error types
export {
    IHttpClient,
    HttpResponse,
    HttpClientError,
    HttpClientParseError,
    HttpClientRequestFailedError,
};

export default class HttpClient implements IHttpClient {
    private authContainer: IAuthContainer;
    private resourceCache: ResourceCache;
    private abortControllerManager: AbortControllerManager;
    private telemetryLogger: TelemetryLogger;

    private requestsInProgress: { [key: string]: Promise<HttpResponse<any>> } = {};
    private sessionId = uuid();

    constructor(
        authContainer: IAuthContainer,
        resourceCache: ResourceCache,
        abortControllerManager: AbortControllerManager,
        telemetryLogger: TelemetryLogger
    ) {
        this.authContainer = authContainer;
        this.resourceCache = resourceCache;
        this.abortControllerManager = abortControllerManager;
        this.telemetryLogger = telemetryLogger;
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
            init = ensureRequestInit(init, init => ({ ...init, method: 'GET' }));

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
        init = ensureRequestInit(init, init => ({
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
        init = ensureRequestInit(init, init => ({
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
        init = ensureRequestInit(init, init => ({
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
        init = ensureRequestInit(init, init => ({
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
        init = ensureRequestInit(init, init => ({
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

    async postFormAsync<TResponse, TExpectedErrorResponse>(
        url: string,
        form: FormData,
        onProgress?: (percentage: number, event: ProgressEvent<XMLHttpRequestEventTarget>) => void
    ): Promise<HttpResponse<TResponse>> {
        const token = await this.authContainer.acquireTokenAsync(url);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (onProgress) {
                xhr.upload.addEventListener('progress', e => {
                    if (e.lengthComputable) {
                        const percentage = Math.round((e.loaded * 100) / e.total);
                        onProgress(percentage, e);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                const headerLines = xhr.getAllResponseHeaders();
                const headers = headerLines.trim().split(/[\r\n]+/);

                var headerMap = new Headers();
                headers.forEach(function(line) {
                    const parts = line.split(': ');
                    const header = parts.shift();
                    const value = parts.join(': ');
                    if (header) headerMap.append(header, value);
                });

                const response: HttpResponse<TResponse> = {
                    data: JSON.parse<TResponse>(xhr.responseText),
                    status: xhr.status,
                    headers: headerMap,
                    refreshRequest: null,
                };
                resolve(response);
            });

            xhr.upload.addEventListener('error', () => {
                const response = xhr.responseText;
                if (response) {
                    const errorResponse = JSON.parse<TExpectedErrorResponse>(response);
                    reject(new HttpClientRequestFailedError(url, xhr.status, errorResponse));
                }
                reject(new HttpClientRequestFailedError(url, xhr.status, null));
            });

            xhr.setRequestHeader('X-Session-Id', this.sessionId);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('x-pp-refresh', 'true');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);

            xhr.open('POST', url, true);

            xhr.send(form);
        });
    }

    async getBlobAsync<TExpectedErrorResponse>(
        url: string,
        init?: RequestInit | null
    ): Promise<File> {
        if (!init) {
            {
                new Headers({ Accept: '*/*' });
            }
        }

        init = ensureRequestInit(init, init => ({
            ...init,
            method: 'GET',
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        const blob = await response.blob();

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename;
        if (contentDisposition != null) {
            const parts = contentDisposition.split(';');
            for (const part of parts) {
                if (part.indexOf('filename=') !== -1) {
                    filename = part.split('=')[1];
                    break;
                }
            }
        }

        if (!filename) {
            throw new Error('Cannot download file without filename');
        }

        return new File([blob], filename);
    }

    private async performFetchAsync<TExpectedErrorResponse>(
        url: string,
        init: RequestInit
    ): Promise<Response> {
        try {
            const options = await this.transformRequestAsync(url, init);

            const response = await fetch(url, options);

            if (!response.ok) {
                // Add more info
                const errorResponse = await this.parseResponseJSONAsync<TExpectedErrorResponse>(
                    response
                );

                throw new HttpClientRequestFailedError(url, response.status, errorResponse);
            }

            return response;
        } catch (error) {
            if (error instanceof HttpClientRequestFailedError) {
                // TODO: Add to notification center?
                // TODO: Update cache status?
                throw error;
            }

            this.telemetryLogger.trackException({ exception: error });

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
                delete this.requestsInProgress[url];
                return data;
            } catch (error) {
                delete this.requestsInProgress[url];
                throw error;
            }
        };

        const request = requestPerformer();

        this.requestsInProgress[url] = request;

        return await request;
    }

    // Response parsers
    private async parseResponseJSONAsync<TResponse>(response: Response) {
        try {
            const text = await response.text();
            const json = JSON.parse<TResponse>(text);
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

        return this.createHttpResponse<TResponse, TExpectedErrorResponse>(request, response, data);
    }

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
        return this.transformHeaders(init, headers =>
            headers.append('X-Session-Id', this.sessionId)
        );
    }

    private addAcceptJsonHeader(init: RequestInit) {
        return this.transformHeaders(init, headers => headers.append('Accept', 'application/json'));
    }

    private addRefreshHeader(init: RequestInit) {
        return this.transformHeaders(init, headers => headers.append('x-pp-refresh', 'true'));
    }

    private async addAuthHeaderAsync(url: string, init: RequestInit) {
        const token = await this.authContainer.acquireTokenAsync(url);
        return this.transformHeaders(init, headers =>
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
        return this.requestsInProgress[url] as Promise<HttpResponse<T>>;
    }

    private createRequestBody<TBody extends RequestBody>(body: TBody) {
        if (typeof body === 'function') {
            const bodyFactory = body as () => string;
            return bodyFactory();
        }

        return JSON.stringify(body);
    }
}

export const useHttpClient = () => {
    const { http } = useFusionContext();
    return http.client;
};
