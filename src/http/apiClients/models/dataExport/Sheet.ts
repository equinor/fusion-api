export type Sheet = {
    columns: {
        name: string;
        type: string;
    }[];
    rows: unknown[][];
};
