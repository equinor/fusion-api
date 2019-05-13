import combineUrls from "../../utils/combineUrls";
import ServiceResolver from "./ServiceResolver";
import BaseResourceCollection from "./BaseResourceCollection";

export default class DataProxyResourceCollection extends BaseResourceCollection {
    private baseUrl: string;

    constructor(serviceResolver: ServiceResolver) {
        super(serviceResolver);
        this.baseUrl = serviceResolver.getDataProxyBaseUrl();
    }

    private getSiteAndProjectUrl(siteCode: string, projectIdentifier: string, action: string): string {
        return combineUrls(this.baseUrl, "/api/sites", siteCode, "projects", projectIdentifier, action);
    }

    handover(siteCode: string, projectIdentifier: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, "handover");
    }
}