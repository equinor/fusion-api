type WOMaterialAccumulated = {
    weekNumber: string | null;
    woRemaining: number;
    woWithMaterialRemaining: number;
};

type WOMaterialDataQuality = {
    commpkgNumber: string | null;
    constructionComments: string | null;
    date: string | null;
    description: string | null;
    discipline: string | null;
    disciplineCode: string | null;
    estimatedHours: number;
    expendedHours: number;
    holdBy: string | null;
    holdByDescription: string | null;
    hourType: string | null;
    materialComments: string | null;
    materialStatus: string | null;
    mccrStatus: string | null;
    milestone: string | null;
    milestoneCode: string | null;
    offshore: boolean;
    onshore: boolean;
    order: number;
    plannedFinishDate: string | null;
    plannedStartDate: string | null;
    proCoSysSiteName: string | null;
    projectIdentifier: string | null;
    projectProgress: string | null;
    remainingHours: number;
    responsible: string | null;
    responsibleCode: string | null;
    rowKey: string | null;
    siteCode: string | null;
    url: string | null;
    w1ActualDate: string | null;
    w2ActualDate: string | null;
    w3ActualDate: string | null;
    w4ActualDate: string | null;
    w5ActualDate: string | null;
    w6ActualDate: string | null;
    w7ActualDate: string | null;
    w8ActualDate: string | null;
    w9ActualDate: string | null;
    w10ActualDate: string | null;
    workOrderId: string | null;
    workOrderNumber: string | null;
};

export type AccumulatedWOMaterialContainer = {
    accumulated: WOMaterialAccumulated[];
    dataQuality: WOMaterialDataQuality[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
