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

    private requestsInProgress: { [key: string]: Promise<HttpResponse<any>> } = {};
    private sessionId = uuid();

    constructor(
        authContainer: IAuthContainer,
        resourceCache: ResourceCache,
        abortControllerManager: AbortControllerManager
    ) {
        this.authContainer = authContainer;
        this.resourceCache = resourceCache;
        this.abortControllerManager = abortControllerManager;
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

    private async performFetchAsync<TExpectedErrorResponse>(
        url: string,
        init: RequestInit
    ): Promise<Response> {
        try {
            const options = await this.transformRequestAsync(url, init);

            const response = await fetch(url, options);

            // TODO: Track dependency with app insight

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
