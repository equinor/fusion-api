import PositionInstance from './PositionInstance';
import PositionFoundation from './PositionFoundation';

type Position = PositionFoundation & {
    instances: PositionInstance[];
    properties: {
        isSupport?: boolean;
        hideInTree?: boolean;
    };
    directChildCount: number;
    totalChildCount: number;
    projectId: string;
    contractId: string | null;
    reportsTo?: PositionFoundation[];
};

export default Position;
