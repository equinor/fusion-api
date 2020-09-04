type CreateSnapshotRequest = {
    type: string;
    baseline: string;
    appliesForDate: Date;
    description?: string;
    approvalRequired?: boolean;
};

export default CreateSnapshotRequest;
