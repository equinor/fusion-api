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

    public async updateAppUserSettings(appKey: string, userSettings: Record<string, unknown>) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.putAsync<
            Record<string, unknown>,
            Record<string, unknown>,
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

    public async updateFusionUserSettings(userSettings: Record<string, unknown>) {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.putAsync<
            Record<string, unknown>,
            Record<string, unknown>,
            FusionApiHttpErrorResponse
        >(url, userSettings);
    }

    public async deleteAllFusionUserSettings() {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.deleteAsync<any, FusionApiHttpErrorResponse>(url);
    }
}

export default UserSettingsClient;
