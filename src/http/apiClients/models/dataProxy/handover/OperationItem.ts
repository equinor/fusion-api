import { HandoverItem } from './HandoverItem';
import { OperationLineStatus } from './OperationLineStatus';

export type OperationItem = HandoverItem & {
    yellowLineStatus: OperationLineStatus;
    blueLineStatus: OperationLineStatus;
};
