import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';

export class UserSettingsClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getPeopleBaseUrl();
    }

    public async getAppUserSettings(appKey: string) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async updateAppUserSettings(appKey: string, userSettings: Record<string, Array<any>>) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.putAsync<
            Record<string, Array<any>>,
            Record<string, Array<any>>,
            FusionApiHttpErrorResponse
        >(url, userSettings);
    }

    public async deleteAllAppUserSettings(appKey: string) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.deleteAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async getFusionUserSettings() {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async updateFusionUserSettings(userSettings: Record<string, Array<any>>) {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.putAsync<
            Record<string, Array<any>>,
            Record<string, Array<any>>,
            FusionApiHttpErrorResponse
        >(url, userSettings);
    }

    public async deleteAllFusionUserSettings() {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.deleteAsync<any, FusionApiHttpErrorResponse>(url);
    }
}

export default UserSettingsClient;
