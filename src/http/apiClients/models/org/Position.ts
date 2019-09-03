import BasePosition from './BasePosition';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';

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

export { BasePosition, PositionInstance, AssignedPerson, PositionLocation };

export default Position;
