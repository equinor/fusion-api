export type SwcrStatus =
    | 'Closed - Rejected'
    | 'Closed'
    | 'Not initiated'
    | 'Accepted'
    | 'Ready for Retest'
    | 'Initiated'
    | 'Tested';

export type SwcrPackage = {
    siteCode: string;
    projectIdentifier: string;
    projectDescription: string;
    swcrNo: string;
    title: string;
    description: string;
    modification: string;
    priority: string;
    system: string;
    controlSystem: string;
    contract: string;
    action: string;
    supplier: string;
    node: string;
    status: SwcrStatus;
    referenceTypes: string;
    types: string;
    createdAtDate: string;
    updatedAtDate: string;
    dueAtDate: string;
    closedAtDate: string;
    nextToSign: string;
    nextSignRanking: string;
    estimatedManhours: string;
    cntAttachments: string;
    cpkgNo: string;
    cpkgPhase: string;
    cpkgStartPlannedAtDate: string;
    cpkgStartForecastAtDate: string;
    cpkgFinishPlannedAtDate: string;
    cpkgFinishForecastAtDate: string;
    url: string;
    rowKey: string;
    latestSignRanking: string;
    swcrId: string;
};
