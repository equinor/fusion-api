import BasePosition from './BasePosition';
import PositionInstance from './PositionInstance';
import AssignedPerson from './AssignedPerson';
import PositionLocation from './PositionLocation';

type Position = {
    id: string;
    externalId: string;
    name: string;
    parentPositionId: string;
    basePosition: BasePosition;
    instances: PositionInstance[];
    isSupport: boolean;
};

export { BasePosition, PositionInstance, AssignedPerson, PositionLocation };

export default Position;
