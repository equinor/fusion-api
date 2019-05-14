import {HandoverChild} from "./HandoverChild";

export type HandoverQuery = {
    queryNumber: string;
    title: string;
    status: string;
    nextToSign: string;
} & HandoverChild;