import Position from './Position';

type PositionReportPath = {
    path: string[];
    reportPositions: {
        id: string;
        position: Position;
        error?: 'futurePosition' | 'pastPosition';
    }[];
    taskOwners: Position[];
};

export default PositionReportPath;
