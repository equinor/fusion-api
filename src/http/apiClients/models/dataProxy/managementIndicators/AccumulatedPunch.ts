type PunchAccumulated = {
    clearedPacount: number;
    clearedPBCount: number;
    createdPACount: number;
    createdPBCount: number;
    duePACount: number;
    duePBCount: number;
    unVerifiedPACount: number;
    verifiedPACount: number;
    verifiedPBCount: number;
    weekNumber: string | null;
};

type PunchAccumulatedData = {
    clearedAtDate: string | null;
    createdAtDate: string | null;
    dueAtDate: string | null;
    formular: string | null;
    formularGroup: string | null;
    projectIdentifier: string | null;
    punchId: string | null;
    punchType: string | null;
    responsible: string | null;
    rowKey: string | null;
    siteCode: string | null;
    tagNumber: string | null;
    updatedAtDate: string | null;
    url: string | null;
    verifiedAtDate: string | null;
};

export type AccumulatedPunchContainer = {
    accumulated: PunchAccumulated[];
    dataQuality: PunchAccumulatedData[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
