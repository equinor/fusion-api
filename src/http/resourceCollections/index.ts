import DataProxyResourceCollection from './DataProxyResourceCollection';
import FusionResourceCollection from './FusionResourceCollection';
import ContextResourceCollection from './ContextResourceCollection';
import TasksResourceCollection from './TasksResourceCollection';
import ServiceResolver from './ServiceResolver';
import { FusionContextOptions } from '../../core/FusionContext';
import PeopleResourceCollection from './PeopleResourceCollection';
import OrgResourceCollection from './OrgResourceCollection';

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
    context: ContextResourceCollection;
    tasks: TasksResourceCollection;
    people: PeopleResourceCollection;
    org: OrgResourceCollection;
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
});

export default ResourceCollections;
