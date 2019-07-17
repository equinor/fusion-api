import uuid from "uuid/v1";
import { IAuthContainer } from "../../auth/AuthContainer";
import AbortControllerManager from "../../utils/AbortControllerManager";
import IHttpClient from "./IHttpClient";
import { HttpResponse } from "./HttpResponse";
import ResourceCache from "../ResourceCache";
import {
    HttpClientError,
    HttpClientParseError,
    HttpClientRequestFailedError,
} from "./HttpClientError";
import ensureRequestInit from "./ensureRequestInit";
import { useFusionContext } from "../../core/FusionContext";

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

    async getAsync<T, TExpectedErrorResponse>(
        url: string,
        init?: RequestInit
    ): Promise<HttpResponse<T>> {
        const result = await this.getStringAsync<TExpectedErrorResponse>(url, init);
        const data = JSON.parse(result.data) as T;

        const response: HttpResponse<T> = {
            ...result,
            data,
        };

        return response;
    }

    async getStringAsync<TExpectedErrorResponse>(url: string, init?: RequestInit) {
        // Reuse GET requests in progress
        const requestInProgress = this.getRequestInProgress<string>(url);
        if (requestInProgress) {
            return await requestInProgress;
        }

        await this.resourceCache.setIsFetchingAsync(url);

        const requestInit = ensureRequestInit(init, init => ({ ...init, method: "GET" }));

        try {
            const request = this.performFetchAsync<TExpectedErrorResponse>(url, requestInit);

            this.requestsInProgress[url] = new Promise<HttpResponse<string>>(
                async (resolve, reject) => {
                    try {
                        const response = await request;
                        const data = await this.parseResponseStringAsync<TExpectedErrorResponse>(requestInit, response);

                        delete this.requestsInProgress[url];

                        await this.resourceCache.updateAsync(url, data);

                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                }
            );

            return await (this.requestsInProgress[url] as Promise<HttpResponse<string>>);
        } catch (error) {
            delete this.requestsInProgress[url];
            throw error;
        }
    }

    async postAsync<TBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit
    ) {
        init = ensureRequestInit(init, init => ({
            ...init,
            method: "POST",
            body: JSON.stringify(body),
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(init, response);
    }

    async putAsync<TBody, TResponse, TExpectedErrorResponse>(
        url: string,
        body: TBody,
        init?: RequestInit
    ) {
        init = ensureRequestInit(init, init => ({
            ...init,
            method: "PUT",
            body: JSON.stringify(body),
        }));

        const response = await this.performFetchAsync<TExpectedErrorResponse>(url, init);
        return await this.parseResponseAsync<TResponse, TExpectedErrorResponse>(init, response);
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

    // Response parsers
    private async parseResponseJSONAsync<TResponse>(response: Response) {
        try {
            const json = await response.json();
            return json as TResponse;
        } catch (parseError) {
            // Add more info
            throw new HttpClientParseError(response);
        }
    }

    private async parseResponseStringAsync<TExpectedErrorResponse>(request: RequestInit, response: Response): Promise<HttpResponse<string>> {
        const data = await response.text();
        // TODO: Update cache status?

        return this.createHttpResponse<string, TExpectedErrorResponse>(request, response, data);
    }

    private async parseResponseAsync<TResponse, TExpectedErrorResponse>(request: RequestInit, response: Response): Promise<HttpResponse<TResponse>> {
        const data = await this.parseResponseJSONAsync<TResponse>(response);
        // TODO: Update cache status?

        return this.createHttpResponse<TResponse, TExpectedErrorResponse>(request, response, data);
    }

    private createHttpResponse<TResponse, TExpectedErrorResponse>(request: RequestInit, response: Response, data: TResponse) {
        const httpResponse: HttpResponse<TResponse> = {
            data,
            status: response.status,
            headers: response.headers,
            refreshRequest: null,
        };

        if(this.responseIsRefreshable(response)) {
            const refreshRequest = this.addRefreshHeader(request);

            return {
                ...httpResponse,
                refreshRequest,
            };
        }

        return httpResponse;
    }

    private responseIsRefreshable(response: Response) {
        return response.headers.get("x-pp-is-refreshable") !== null;
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
            headers.append("X-Session-Id", this.sessionId)
        );
    }

    private addAcceptJsonHeader(init: RequestInit) {
        return this.transformHeaders(init, headers => headers.append("Accept", "application/json"));
    }

    private addRefreshHeader(init: RequestInit) {
        return this.transformHeaders(init, headers => headers.append("x-pp-refresh", "true"));
    }

    private async addAuthHeaderAsync(url: string, init: RequestInit) {
        const token = await this.authContainer.acquireTokenAsync(url);
        return this.transformHeaders(init, headers =>
            headers.append("Authorization", "Bearer " + token)
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
}

export const useHttpClient = () => {
    const { http } = useFusionContext();
    return http.client;
};
