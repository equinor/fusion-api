import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from '.';

export class UserSettingsClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionBaseUrl();
    }

    public async getAppUserSettings(appKey: string) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async updateAppUserSettings<T>(appKey: string, userSettings: T) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.putAsync<T, T, FusionApiHttpErrorResponse>(url, userSettings);
    }

    public async deleteAllAppUserSettings(appKey: string) {
        const url = this.resourceCollections.userSettings.appUserSettings(appKey);
        return await this.httpClient.deleteAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async getFusionUserSettings() {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    public async updateFusionUserSettings<T>(userSettings: T) {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.putAsync<T, T, FusionApiHttpErrorResponse>(url, userSettings);
    }

    public async deleteAllFusionUserSettings() {
        const url = this.resourceCollections.userSettings.fusionUserSettings();
        return await this.httpClient.deleteAsync<any, FusionApiHttpErrorResponse>(url);
    }
}

export default UserSettingsClient;
