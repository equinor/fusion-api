import { HandoverChild } from './HandoverChild';

export type HandoverSWCR = {
    swcrNumber: string;
    status: string;
    description: string;
    priority: string;
} & HandoverChild;
