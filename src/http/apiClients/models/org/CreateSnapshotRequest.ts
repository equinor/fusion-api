type CreateSnapshotRequest = {
    type: string;
    baseline: string;
    description?: string;
    approvalRequired?: boolean;
}

export default CreateSnapshotRequest;