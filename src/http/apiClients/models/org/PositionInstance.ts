import PositionLocation from './PositionLocation';
import AssignedPerson from './AssignedPerson';
import { Organisation } from './Organisation';

type PositionInstanceType = 'Normal' | 'Rotation';

type PositionInstanceProperties = {
    workPackId?: string;
    hasRequest?: boolean;
};

type PositionInstance = {
    id: string;
    obs: string;
    workload: number;
    appliesFrom: Date;
    appliesTo: Date;
    type: PositionInstanceType; // Normal/Offshore/Vacation etc.
    location: PositionLocation;
    assignedPerson: AssignedPerson | null;
    properties: PositionInstanceProperties | null;
    rotationId: string | null;
    taskOwnerIds: string[] | null;
    reportsToIds?: string[];
    isDeleted: boolean;
    positionId: string;
    externalId: string;
    parentPositionId: string | null;
    hasChangesInDraft?: boolean;
    organisation?: Organisation | null;
};

export default PositionInstance;
