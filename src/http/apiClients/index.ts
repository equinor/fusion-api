import DataProxyClient from "./DataProxyClient";
import ResourceCollections from "../resourceCollections";
import { IHttpClient } from "../HttpClient";

type ApiClients = {
    dataProxy: DataProxyClient;
};

export const createClients = (
    httpClient: IHttpClient,
    resources: ResourceCollections
): ApiClients => ({
    dataProxy: new DataProxyClient(httpClient, resources),
});

export default ApiClients;
