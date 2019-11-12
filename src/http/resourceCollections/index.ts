import DataProxyResourceCollection from './DataProxyResourceCollection';
import FusionResourceCollection from './FusionResourceCollection';
import ContextResourceCollection from './ContextResourceCollection';
import TasksResourceCollection from './TasksResourceCollection';
import ServiceResolver from './ServiceResolver';
import { FusionContextOptions } from '../../core/FusionContext';
import PeopleResourceCollection from './PeopleResourceCollection';
import OrgResourceCollection from './OrgResourceCollection';
import ReportResourceCollection from './ReportResourceCollection';
import PowerBIResourceCollection from './PowerBIResourceCollection';

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
    context: ContextResourceCollection;
    tasks: TasksResourceCollection;
    people: PeopleResourceCollection;
    org: OrgResourceCollection;
    report: ReportResourceCollection;
    powerBI: PowerBIResourceCollection;
};

export { DataProxyResourceCollection };

export const createResourceCollections = (
    serviceResolver: ServiceResolver,
    options?: FusionContextOptions
): ResourceCollections => ({
    dataProxy: new DataProxyResourceCollection(serviceResolver),
    fusion: new FusionResourceCollection(serviceResolver, options),
    context: new ContextResourceCollection(serviceResolver),
    tasks: new TasksResourceCollection(serviceResolver),
    people: new PeopleResourceCollection(serviceResolver),
    org: new OrgResourceCollection(serviceResolver),
    report: new ReportResourceCollection(serviceResolver),
    powerBI: new PowerBIResourceCollection(serviceResolver),
});

export default ResourceCollections;
