import combineUrls from "../../utils/combineUrls";
import ServiceResolver from "./ServiceResolver";

export default class DataProxyResources {
    protected baseUrl: string;

    constructor(serviceResolver: ServiceResolver) {
        this.baseUrl = serviceResolver.getDataProxyBaseUrl();
    }

    private getSiteAndProjectUrl(siteCode: string, projectIdentifier: string, action: string): string {
        return combineUrls(this.baseUrl, "/api/sites", siteCode, "projects", projectIdentifier, action);
    }

    handover(siteCode: string, projectIdentifier: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, "handover");
    }
}