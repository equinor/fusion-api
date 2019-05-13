import { IHttpClient, HttpResponse } from "../HttpClient";
import DataProxyResources from "../resources/dataProxy";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import { HandoverItem } from "./models/dataProxy";

// Export models
export { HandoverItem };

export default class DataProxyClient {
    private httpClient: IHttpClient;
    private dataProxyResources: DataProxyResources;

    constructor(httpClient: IHttpClient, dataProxyResources: DataProxyResources) {
        this.httpClient = httpClient;
        this.dataProxyResources = dataProxyResources;
    }

    async getHandoverAsync(
        siteCode: string,
        projectIdentifier: string
    ): Promise<HttpResponse<HandoverItem[]>> {
        const url = this.dataProxyResources.handover(siteCode, projectIdentifier);
        return await this.httpClient.getAsync<HandoverItem[], FusionApiHttpErrorResponse>(url);
    }
}
