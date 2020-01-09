import PositionLocation from './PositionLocation';
import AssignedPerson from './AssignedPerson';

type PositionInstanceType = 'Normal' | 'Rotation';

type PositionInstance = {
    id: string;
    obs: string;
    workload: number;
    appliesFrom: Date;
    appliesTo: Date;
    type: PositionInstanceType; // Normal/Offshore/Vacation etc.
    location: PositionLocation;
    assignedPerson: AssignedPerson | null;
    properties: object; // dynamic metadata
    rotationId: string | null;
    taskOwnerIds: string[] | null;
    reportsToIds?: string[];
    isDeleted: boolean;
    positionId: string;
    externalId: string;
    parentPositionId: string | null;

};

export default PositionInstance;
