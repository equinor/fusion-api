import { HttpResponse } from "../HttpClient";
import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import { HandoverItem } from "./models/dataProxy";

// Export models
export { HandoverItem };

export default class DataProxyClient extends BaseApiClient {
    async getHandoverAsync(
        siteCode: string,
        projectIdentifier: string
    ): Promise<HttpResponse<HandoverItem[]>> {
        const url = this.resourceCollections.dataProxy.handover(siteCode, projectIdentifier);
        return await this.httpClient.getAsync<HandoverItem[], FusionApiHttpErrorResponse>(url);
    }
}
