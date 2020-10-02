import { IHttpClient } from '../HttpClient';
import ResourceCollections from '../resourceCollections';
import { combineUrls } from '../../utils/url';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import { ResponseParser } from '../HttpClient/IHttpClient';
import ServiceResolver from '../resourceCollections/ServiceResolver';

export default abstract class BaseApiClient {
    constructor(
        protected httpClient: IHttpClient,
        protected resourceCollections: ResourceCollections,
        protected serviceResolver: ServiceResolver
    ) {}

    protected abstract getBaseUrl(): string;

    public async getAsync<TResponse>(
        path: string,
        init?: RequestInit,
        responseParser?: ResponseParser<TResponse>
    ) {
        const url = combineUrls(this.getBaseUrl(), path);
        return await this.httpClient.getAsync<TResponse, FusionApiHttpErrorResponse>(
            url,
            init,
            responseParser
        );
    }

    public async postAsync<TBody, TResponse>(
        path: string,
        body: TBody,
        init?: RequestInit,
        responseParser?: ResponseParser<TResponse>
    ) {
        const url = combineUrls(this.getBaseUrl(), path);
        return await this.httpClient.postAsync<TBody, TResponse, FusionApiHttpErrorResponse>(
            url,
            body,
            init,
            responseParser
        );
    }

    public async putAsync<TBody, TResponse>(
        path: string,
        body: TBody,
        init?: RequestInit,
        responseParser?: ResponseParser<TResponse>
    ) {
        const url = combineUrls(this.getBaseUrl(), path);
        return await this.httpClient.putAsync<TBody, TResponse, FusionApiHttpErrorResponse>(
            url,
            body,
            init,
            responseParser
        );
    }

    public async patchAsync<TBody, TResponse>(
        path: string,
        body: TBody,
        init?: RequestInit,
        responseParser?: ResponseParser<TResponse>
    ) {
        const url = combineUrls(this.getBaseUrl(), path);
        return await this.httpClient.patchAsync<TBody, TResponse, FusionApiHttpErrorResponse>(
            url,
            body,
            init,
            responseParser
        );
    }

    public async deleteAsync<TResponse>(
        path: string,
        init?: RequestInit,
        responseParser?: ResponseParser<TResponse>
    ) {
        const url = combineUrls(this.getBaseUrl(), path);
        return await this.httpClient.deleteAsync<TResponse, FusionApiHttpErrorResponse>(
            url,
            init,
            responseParser
        );
    }
}
