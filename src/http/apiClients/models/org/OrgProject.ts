import BasePosition from './BasePosition';
import Position from './Position';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';
import FusionProject from './FusionProject';
import OrgProjectType from './OrgProjectType';
import CreateOrgProject from './CreateOrgProject';

type OrgProject = {
    dates: {
        endDate: Date | null;
        startDate: Date | null;
        gates: {
            dG1: Date | null,
            dG2: Date | null,
            dG3: Date | null,
            dG4: Date | null,
        }
    };
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
    CreateOrgProject
};

export default OrgProject;
