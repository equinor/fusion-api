import PositionLocation from './PositionLocation';

type PositionInstance = {
    obs: string;
    percent: number;
    appliesFrom: string;
    appliesTo: string;
    type: string; // Normal/Offshore/Vacation etc.
    location: PositionLocation;
    properties: object; // dynamic metadata
};

export default PositionInstance;
