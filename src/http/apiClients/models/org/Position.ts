import PositionInstance from './PositionInstance';
import PositionRef from './PositionRef';

type Position = PositionRef & {
    instances: PositionInstance[];
    properties: {
        isSupport?: boolean;
        hideInTree?: boolean;
    };
    directChildCount: number;
    totalChildCount: number;
    projectId: string;
    contractId: string | null;
    reportsTo?: PositionRef[];
};

export default Position;
