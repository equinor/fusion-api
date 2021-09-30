export type DataExportResponse = {
    tempKey: string;
    expireDate: Date;
    exportState: 'New' | 'Complete';
};
