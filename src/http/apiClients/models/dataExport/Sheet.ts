export type AllowedExcelTypes = 'string' | 'integer' | 'datetime' | 'boolean' | 'url';
export type Sheet = {
    columns: {
        name: string;
        type: AllowedExcelTypes;
    }[];
    rows: unknown[][];
};
