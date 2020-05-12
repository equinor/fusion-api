import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import AppManifest from './models/fusion/apps/AppManifest';
import { FeatureLogBatch } from './models/fusion/FeatureLogEntryRequest';
import getScript from '../../utils/getScript';
import { SignalRNegotiation } from './models/fusion/SignalRNegotiation';

export default class FusionClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getAppsAsync() {
        const url = this.resourceCollections.fusion.apps();
        return await this.httpClient.getAsync<AppManifest[], FusionApiHttpErrorResponse>(url);
    }

    async getAppManifestAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appManifest(appKey);
        return await this.httpClient.getAsync<AppManifest, FusionApiHttpErrorResponse>(url);
    }

    async loadAppScriptAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appScript(appKey);
        return await getScript(url);
    }

    async logFeaturesAsync(batch: FeatureLogBatch) {
        const url = this.resourceCollections.fusion.featureLog();
        return await this.httpClient.postAsync<FeatureLogBatch, void, FusionApiHttpErrorResponse>(
            url,
            batch,
            null,
            () => Promise.resolve()
        );
    }

    async getAppIconAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appIcon(appKey);
        return await this.httpClient.getAsync<string, Error>(
            url,
            { credentials: 'include' },
            async (response: Response) => {
                return await response.text();
            }
        );
    }

    async negotiateSignalRHub(hubName: string) {
        const url = this.resourceCollections.fusion.signalRHub(hubName);
        return await this.httpClient.postAsync<
            null,
            SignalRNegotiation,
            FusionApiHttpErrorResponse
        >(url, null);
    }
}
