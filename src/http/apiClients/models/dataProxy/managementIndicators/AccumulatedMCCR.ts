type AccumulatedMCCR = {
    plannedCount: number;
    signedCount: number;
    verifiedCount: number;
    weekNumber: string | null;
};

type DataQuailityMCCR = {
    checkId: string | null;
    createdAtDate: string | null;
    formular: string | null;
    plannedAtDate: string | null;
    projectIdentifier: string | null;
    responsible: string | null;
    rowKey: string | null;
    signedAtDate: string | null;
    siteCode: string | null;
    status: string | null;
    tagNumber: string | null;
    updatedAtDate: string | null;
    url: string | null;
    verifiedAtDate: string | null;
};

export type AccumulatedMCCRContainer = {
    accumulated: AccumulatedMCCR[];
    dataQuality: DataQuailityMCCR[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
