import PositionLocation from './PositionLocation';
import AssignedPerson from './AssignedPerson';

type PositionInstanceType = 'Normal';

type PositionInstance = {
    id: string;
    obs: string;
    percent: number;
    appliesFrom: Date;
    appliesTo: Date;
    type: PositionInstanceType; // Normal/Offshore/Vacation etc.
    location: PositionLocation;
    assignedPerson: AssignedPerson;
    properties: object; // dynamic metadata
};

export default PositionInstance;
