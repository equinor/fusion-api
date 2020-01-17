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

type OrgProject = {
    dates: OrgProjectDates;
    director: Position;
    directorPositionId: string;
    domainId: string;
    name: string;
    projectId: string;
    projectType: OrgProjectType;
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
};

export default OrgProject;
