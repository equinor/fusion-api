import DataProxyClient from "./DataProxyClient";
import ResourceCollections from "../resourceCollections";
import { IHttpClient } from "../HttpClient";
export { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";

type ApiClients = {
    dataProxy: DataProxyClient;
};

export const createApiClients = (
    httpClient: IHttpClient,
    resources: ResourceCollections
): ApiClients => ({
    dataProxy: new DataProxyClient(httpClient, resources),
});

export default ApiClients;
