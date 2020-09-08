import { HandoverChild } from './HandoverChild';

export type HandoverUnsignedAction = {
    actionNumber: string;
    title: string;
    description: string;
} & HandoverChild;
