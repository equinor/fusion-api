import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';
import { QuickFact } from './models/info/QuickFact';

export class InfoClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getInfoUrl();
    }

    public getQuickFacts(scope: string) {
        const url = this.resourceCollections.info.quickFacts(scope);
        return this.httpClient.getAsync<Array<QuickFact>, FusionApiHttpErrorResponse>(url);
    }

    public getQuickFact(scope: string, id: string) {
        const url = this.resourceCollections.info.quickFact(scope, id);
        return this.httpClient.getAsync<QuickFact, FusionApiHttpErrorResponse>(url);
    }

    public async updateQuickFact(scope: string, value: QuickFact) {
        const url = this.resourceCollections.info.quickFact(scope, value.anchor);
        return this.httpClient.putAsync<QuickFact, QuickFact, FusionApiHttpErrorResponse>(url, value);
    }
}

export default InfoClient;