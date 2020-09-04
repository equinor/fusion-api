import { HandoverChild } from './HandoverChild';

export type HandoverMcpkg = {
    mcPkgNo: string;
    description: string;
    mcStatus: string;
    rfccShippedActualDate: string;
    rfccAcceptedActualDate: string;
    rfocIsShipped: boolean;
    rfocIsAccepted: boolean;
    rfocIsRejected: boolean;
    rfccIsShipped: boolean;
    rfccIsAccepted: boolean;
    rfccIsRejected: boolean;
} & HandoverChild;
