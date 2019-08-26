import PositionLocation from './PositionLocation';
import AssignedPerson from './AssignedPerson';

type PositionInstance = {
    obs: string;
    percent: number;
    appliesFrom: string;
    appliesTo: string;
    type: string; // Normal/Offshore/Vacation etc.
    location: PositionLocation;
    assignedPerson: AssignedPerson;
    properties: object; // dynamic metadata
};

export default PositionInstance;
