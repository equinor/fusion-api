import BasePosition from './BasePosition';
import Position from './Position';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';
import FusionProject from './FusionProject';
import OrgProjectType from './OrgProjectType';
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
    projectType: OrgProjectType;
    properties: OrgProjectProperties | null;
    description?: OrgProjectDescription;
    links?: OrgProjectLink[];
};

export {
    BasePosition,
    Position,
    PositionInstance,
    AssignedPerson,
    PositionLocation,
    FusionProject,
    OrgProjectType,
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
};

export default OrgProject;
