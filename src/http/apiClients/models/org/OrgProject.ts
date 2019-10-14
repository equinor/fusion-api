import BasePosition from './BasePosition';
import Position from './Position';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';
import FusionProject from './FusionProject';
import OrgProjectType from "./OrgProjectType";

type OrgProject = {
    dates: {
        endDate: Date;
        startDate: Date;
    };
    director: Position;
    directorPositionId: string;
    domainId: string;
    name: string;
    projectId: string;
    projectType: OrgProjectType
};

export {
    BasePosition,
    Position,
    PositionInstance,
    AssignedPerson,
    PositionLocation,
    FusionProject,
    OrgProjectType,
};

export default OrgProject;
