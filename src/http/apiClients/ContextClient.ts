import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import { Context, ContextTypes } from "./models/context";

export default class ContextClient extends BaseApiClient {
    async getContextsAsync() {
        const url = this.resourceCollections.context.contexts();
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }

    async getContextAsync(id: string) {
        const url = this.resourceCollections.context.context(id);
        return await this.httpClient.getAsync<Context, FusionApiHttpErrorResponse>(url);
    }

    async queryContextsAsync(query: string, type: ContextTypes | null = null) {
        const url = this.resourceCollections.context.queryContexts(query, type);
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }

    async getRelatedContexts(id: string, type: ContextTypes | null = null) {
        const url = this.resourceCollections.context.relatedContexts(id, type);
        return await this.httpClient.getAsync<Context[], FusionApiHttpErrorResponse>(url);
    }

    async updateContext(context: Context) {
        const url = this.resourceCollections.context.context(context.id);
        return await this.httpClient.putAsync<Context, Context, FusionApiHttpErrorResponse>(url, context);
    }

    async createContext(context: Context) {
        const url = this.resourceCollections.context.contexts();
        return await this.httpClient.postAsync<Context, Context, FusionApiHttpErrorResponse>(url, context);
    }
}
