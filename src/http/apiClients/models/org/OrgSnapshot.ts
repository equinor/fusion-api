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
};

export default OrgSnapshot;
