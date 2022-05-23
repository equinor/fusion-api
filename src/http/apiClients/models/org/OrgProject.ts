import BasePosition from './BasePosition';
import Position from './Position';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';
import FusionProject from './FusionProject';
import CreateOrgProject from './CreateOrgProject';
import OrgProjectDates from './OrgProjectDates';
import Contract from './Contract';
import PublishDetails from './PublishDetails';
import PositionReportPath from './PositionReportPath';
import RoleDescription from './RoleDescription';
import OrgSnapshot, {
    OrgSnapshotApproval,
    OrgSnapshotStatus,
    OrgSnapshotStatusProgress,
} from './OrgSnapshot';
import ApproveSnapshotRequest from './ApproveSnapshotRequest';
import CreateSnapshotRequest from './CreateSnapshotRequest';
import CreateTransientSnapshotRequest from './CreateTransientSnapshotRequest';
import OrgProjectDescription from './OrgProjectDescription';
import OrgProjectLink from './OrgProjectLink';
import { Organisation, OrganisationsRespose } from './Organisation';

type OrgProjectProperties = {
    pimsWriteSyncEnabled?: boolean;
    disableSync?: boolean;
    orgAdminEnabled?: boolean;
    resourceOwnerRequestsEnabled?: boolean;
};

type OrgProject = {
    dates: OrgProjectDates;
    director: Position;
    directorPositionId: string;
    domainId: string;
    name: string;
    projectId: string;
    projectType: string;
    properties: OrgProjectProperties | null;
    description?: OrgProjectDescription;
    links?: OrgProjectLink[];
    lineOrganisation?: {
        task: {
            id: string;
            name: string;
        };
        orgUnit: {
            sapId: string;
            name: string;
            fullDepartment: string;
        };
    };
};

export {
    BasePosition,
    Position,
    PositionInstance,
    AssignedPerson,
    PositionLocation,
    FusionProject,
    CreateOrgProject,
    OrgProjectDates,
    Contract,
    PublishDetails,
    PositionReportPath,
    RoleDescription,
    OrgSnapshot,
    OrgSnapshotApproval,
    ApproveSnapshotRequest,
    CreateSnapshotRequest,
    CreateTransientSnapshotRequest,
    OrgSnapshotStatus,
    OrgSnapshotStatusProgress,
    OrgProjectDescription,
    OrgProjectLink,
    Organisation,
    OrganisationsRespose,
};

export default OrgProject;
