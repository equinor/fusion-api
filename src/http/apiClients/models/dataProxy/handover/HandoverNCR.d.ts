import { HandoverChild } from "./HandoverChild";

export type HandoverNCR = {
    documentNumber: string;
    title: string;
} & HandoverChild;
