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
import NotificationResourceCollection from './NotificationResourceCollection';
import InfoResourceCollection from './InfoResourceCollection';
import UserSettingsResourceCollection from './UserSettingsResoureCollections';
import FusionTasksResourceCollection from './FusionTasksResourceCollection';
import BookmarksResourceCollection from './BookmarksResourceCollection';

type ResourceCollections = {
    dataProxy: DataProxyResourceCollection;
    fusion: FusionResourceCollection;
    context: ContextResourceCollection;
    tasks: TasksResourceCollection;
    people: PeopleResourceCollection;
    org: OrgResourceCollection;
    report: ReportResourceCollection;
    powerBI: PowerBIResourceCollection;
    notification: NotificationResourceCollection;
    info: InfoResourceCollection;
    userSettings: UserSettingsResourceCollection;
    fusionTasks: FusionTasksResourceCollection;
    bookmarks: BookmarksResourceCollection;
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
    notification: new NotificationResourceCollection(serviceResolver),
    info: new InfoResourceCollection(serviceResolver),
    userSettings: new UserSettingsResourceCollection(serviceResolver),
    fusionTasks: new FusionTasksResourceCollection(serviceResolver),
    bookmarks: new BookmarksResourceCollection(serviceResolver),
});

export default ResourceCollections;
