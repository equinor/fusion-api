import DataProxyClient from "./DataProxyClient";
import FusionClient from "./FusionClient";
import ContextClient from "./ContextClient";
import ResourceCollections from "../resourceCollections";
import { IHttpClient } from "../HttpClient";
export { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";

type ApiClients = {
    dataProxy: DataProxyClient;
    fusion: FusionClient;
    context: ContextClient;
};

export const createApiClients = (
    httpClient: IHttpClient,
    resources: ResourceCollections
): ApiClients => ({
    dataProxy: new DataProxyClient(httpClient, resources),
    fusion: new FusionClient(httpClient, resources),
    context: new ContextClient(httpClient, resources),
});

export default ApiClients;
