import { IHttpClient } from "../HttpClient";
import ResourceCollections from "../resourceCollections";

export default abstract class BaseApiClient {
    protected httpClient: IHttpClient;
    protected resourceCollections: ResourceCollections;

    constructor(httpClient: IHttpClient, resourceCollection: ResourceCollections) {
        this.httpClient = httpClient;
        this.resourceCollections = resourceCollection;
    }
}
