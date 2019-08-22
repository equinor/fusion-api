import BasePosition from './BasePosition';
import PositionInstance from './PositionInstance';

type Position = {
    id: string;
    externalId: string;
    name: string;
    parentPositionId: string;
    basePosition: BasePosition;
    instances: PositionInstance[];
    isSupport: boolean;
};

export default Position;
