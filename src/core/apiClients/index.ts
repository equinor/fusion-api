import DataProxyClient from "./DataProxyClient";
import Resources from "../resources";
import { IHttpClient } from "../HttpClient";

type ApiClients = {
    dataProxy: DataProxyClient;
};

export const createClients = (httpClient: IHttpClient, resources: Resources): ApiClients => ({
    dataProxy: new DataProxyClient(httpClient, resources.dataProxy),
});

export default ApiClients;