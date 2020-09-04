import { HandoverChild } from './HandoverChild';

export type HandoverUnsignedTask = {
    taskNumber: string;
    title: string;
} & HandoverChild;
