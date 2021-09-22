import { Sheet } from './Sheet';

export type DataExportRequest = {
    fileName: string;
    dataSetName: string;
    sheets: Sheet[];
};
