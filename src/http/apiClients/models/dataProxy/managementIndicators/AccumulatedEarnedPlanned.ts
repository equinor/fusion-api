type EarnedPlannedAccumulated = {
    earnedHours: number;
    earnedPercentage: number;
    plannedHours: number;
    plannedPercentage: number;
    projectIdentifier: string | null;
    siteCode: string | null;
    weekNumber: string | null;
};

export type AccumulatedEarnedPlannedContainer = {
    accumulated: EarnedPlannedAccumulated[];
    dataQuality: [];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
