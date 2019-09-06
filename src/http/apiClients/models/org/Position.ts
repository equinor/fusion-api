import BasePosition from './BasePosition';
import PositionInstance from './PositionInstance';

type Position = {
    id: string;
    externalId: string;
    name: string;
    parentPositionId: string | null;
    basePosition: BasePosition;
    instances: PositionInstance[];
    properties: {
        isSupport?: boolean;
    };
    directChildCount: number;
    totalChildCount: number;
    projectId: string;
    contractId: string | null;
    reportsTo?: Position[];
};

export default Position;
