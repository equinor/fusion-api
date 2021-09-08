export type DataExportRequest = {
    fileName: string;
    dataSetName: string;
    sheets: {
        columns: {
            name: string;
            type: string;
        }[];
        rows: string[][];
    }[];
};
