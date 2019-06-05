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

    async getAsync<T, TExpectedErrorResponse>(url: string, init?: RequestInit) {
        // Reuse GET requests in progress
        const requestInProgress = this.getRequestInProgress<T>(url);
        if (requestInProgress) {
            return await requestInProgress;
        }

        await this.resourceCache.setIsFetchingAsync(url);

        init = ensureRequestInit(init, init => ({ ...init, method: "GET" }));

        const request = this.performFetchAsync<T, TExpectedErrorResponse>(url, init);
        this.requestsInProgress[url] = request;

        const response = await request;
        delete this.requestsInProgress[url];

        await this.resourceCache.updateAsync(url, response);

        return response;
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

        return await this.performFetchAsync<TResponse, TExpectedErrorResponse>(url, init);
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

        return await this.performFetchAsync<TResponse, TExpectedErrorResponse>(url, init);
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

    private getRequestInProgress<T>(url: string) {
        return this.requestsInProgress[url] as Promise<HttpResponse<T>>;
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

    private async transformRequestAsync(url: string, init: RequestInit) {
        const requestWithSessionId = this.addSessionIdHeader(init);
        const requestWithAcceptJson = this.addAcceptJsonHeader(requestWithSessionId);
        const requestWithAuthToken = await this.addAuthHeaderAsync(url, requestWithAcceptJson);
        const requestWithAbortSignal = this.addAbortSignal(requestWithAuthToken);

        return requestWithAbortSignal;
    }

    private async parseResponseAsync<T>(response: Response) {
        try {
            const json = await response.json();
            return json as T;
        } catch (parseError) {
            // Add more info
            throw new HttpClientParseError(response);
        }
    }

    private responseIsRefreshable(response: Response) {
        return response.headers.get("x-pp-is-refreshable") !== null;
    }

    private async performFetchAsync<T, TExpectedErrorResponse>(
        url: string,
        init: RequestInit
    ): Promise<HttpResponse<T>> {
        try {
            const options = await this.transformRequestAsync(url, init);

            const response = await fetch(url, options);

            // TODO: Track dependency with app insight

            if (!response.ok) {
                // Add more info
                const errorResponse = await this.parseResponseAsync<TExpectedErrorResponse>(
                    response
                );

                throw new HttpClientRequestFailedError(url, response.status, errorResponse);
            }

            const data = await this.parseResponseAsync<T>(response);

            let refreshPromise: Promise<HttpResponse<T>> | null = null;
            if (this.responseIsRefreshable(response)) {
                const refreshOptions = this.addRefreshHeader(options);
                refreshPromise = this.performFetchAsync(url, refreshOptions);
            }

            // TODO: Update cache status?

            return {
                data,
                status: response.status,
                headers: response.headers,
                refreshPromise,
            };
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
}

export const useHttpClient = () => {
    const { http } = useFusionContext();
    return http.client;
};
