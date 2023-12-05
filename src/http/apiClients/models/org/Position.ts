import BasePosition from './BasePosition';
import PositionInstance from './PositionInstance';

type Position = {
    id: string;
    externalId: string | null;
    name: string;
    basePosition: BasePosition;
    instances: PositionInstance[];
    properties: {
        isSupport?: boolean;
        hideInTree?: boolean;
        resourceType?: 'normal' | 'jointVenture' | 'enterprise';
    };
    directChildCount: number;
    totalChildCount: number;
    projectId: string;
    contractId: string | null;
    isTaskOwner: boolean;
    isProjectManagementTeam: boolean;
    hasChangesInDraft?: boolean;
};

export default Position;
