import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import AppManifest from './models/fusion/apps/AppManifest';
import getScript from '../../utils/getScript';

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
}
