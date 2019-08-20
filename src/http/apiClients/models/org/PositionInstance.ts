import Location from './Location';

type PositionInstance = {
    obs: string;
    percent: number;
    appliesFrom: Date;
    appliesTo: Date;
    type: string; // Normal/Offshore/Vacation etc.
    location: Location;
    properties: object; // dynamic metadata
};

export default PositionInstance;
