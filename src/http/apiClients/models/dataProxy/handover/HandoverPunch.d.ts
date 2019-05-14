import { HandoverChild } from "./HandoverChild";

export type HandoverPunch = {
    tagNumber: string;
    status: string;
    description: string;
    toBeClearedBy: string;
    sorting: string;
} & HandoverChild;
