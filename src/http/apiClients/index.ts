import DataProxyClient from './DataProxyClient';
import FusionClient from './FusionClient';
import ContextClient from './ContextClient';
import TasksClient from './TasksClient';
import ResourceCollections from '../resourceCollections';
import { IHttpClient } from '../HttpClient';
import PeopleClient from './PeopleClient';
import OrgClient from './OrgClient';
import ReportClient from './ReportClient';
import PowerBIClient from './PowerBIClient';

export { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';

type ApiClients = {
    dataProxy: DataProxyClient;
    fusion: FusionClient;
    context: ContextClient;
    tasks: TasksClient;
    people: PeopleClient;
    org: OrgClient;
    report: ReportClient;
    powerBI: PowerBIClient;
};

export const createApiClients = (
    httpClient: IHttpClient,
    resources: ResourceCollections
): ApiClients => ({
    dataProxy: new DataProxyClient(httpClient, resources),
    fusion: new FusionClient(httpClient, resources),
    context: new ContextClient(httpClient, resources),
    tasks: new TasksClient(httpClient, resources),
    people: new PeopleClient(httpClient, resources),
    org: new OrgClient(httpClient, resources),
    report: new ReportClient(httpClient, resources),
    powerBI: new PowerBIClient(httpClient, resources),
});

export default ApiClients;
