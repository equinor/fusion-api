import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import { Context, ContextType } from "./models/context";

export default class ContextClient extends BaseApiClient {
    async getContextsAsync() {
        const url = this.resourceCollections.context.contexts();
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }

    async getContextAsync(id: string) {
        const url = this.resourceCollections.context.context(id);
        return await this.httpClient.getAsync<Context, FusionApiHttpErrorResponse>(url);
    }

    async queryContextsAsync(query: string, type: ContextType | null = null) {
        const url = this.resourceCollections.context.queryContexts(query, type);
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }

    async getRelatedContexts(id: string, type: ContextType | null = null) {
        const url = this.resourceCollections.context.relatedContexts(id, type);
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }
}
