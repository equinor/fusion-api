type ProductivityAccumulated = {
    accumulatedProductivityFactor: number;
    productivityFactor: number;
    targetProductivityFactor: number;
    weekNumber: string | null;
};

type ProductivityDataQuality = {
    cutoffId: string | null;
    date: string | null;
    discipline: string | null;
    earnedHours: number;
    expendedHours: number;
    hourType: string | null;
    projectIdentifier: string | null;
    siteCode: string | null;
    week: string | null;
};

export type AccumulatedProductivityContainer = {
    accumulated: ProductivityAccumulated[];
    dataQuality: ProductivityDataQuality[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
