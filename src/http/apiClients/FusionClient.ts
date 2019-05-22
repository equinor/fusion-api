import { HttpResponse } from "../HttpClient";
import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import AppManifest from "./models/fusion/apps/AppManifest";
import getScript from "../../utils/getScript";

export default class FusionClient extends BaseApiClient {
    async getAppsAsync(): Promise<HttpResponse<any>> {
        const url = this.resourceCollections.fusion.apps();
        return await this.httpClient.getAsync<any, FusionApiHttpErrorResponse>(url);
    }

    async getAppManifestAsync(appKey: string): Promise<HttpResponse<AppManifest>> {
        const url = this.resourceCollections.fusion.appManifest(appKey);
        return await this.httpClient.getAsync<AppManifest, FusionApiHttpErrorResponse>(url);
    }

    async loadAppScriptAsync(appKey: string): Promise<void> {
        const url = this.resourceCollections.fusion.appScript(appKey);
        return await getScript(url);
    }
}