import { HandoverChild } from './HandoverChild';

export type HandoverWorkOrder = {
    workOrderNumber: string;
    workOrderStatus: string;
    workOrderStatusDescription: string;
    description: string;
    materialStatus: string;
    materialStatusDescription: string;
    projectProgress: string;
} & HandoverChild;
