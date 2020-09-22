import PersonDetails from '../people/PersonDetails';
import BasePosition from './BasePosition';

export type OrgSnapshotApproval = {
    approvedBy: PersonDetails;
    approved: Date;
    comment: string;
    positions: {
        basePositions: BasePosition[];
        positionIds: string[];
    };
};
export type OrgSnapshotStatusProgress = {
    total: number;
    proceeded: number;
};

export type OrgSnapshotStatus = {
    hasInvalidEvents: boolean;
    initializationCompletedAt: Date | null;
    initializedAt: Date | null;
    isInitialized: boolean;
    message: string;
    progress: OrgSnapshotStatusProgress | null;
    failedAt?: Date;
    errorMessage?: string;
};

type OrgSnapshot = {
    id: string;
    type: string;
    baseline: string;
    description?: string;
    approvalRequired: boolean;
    created: Date;
    appliesForDate: Date;
    createdBy: PersonDetails | null;
    approval?: OrgSnapshotApproval;
    status: OrgSnapshotStatus;
};

export default OrgSnapshot;
