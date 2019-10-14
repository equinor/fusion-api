type InstallationAccumulated = {
    accumulatedInstallationFactor: number;
    installationFactor: number;
    plannedInstallationFactor: number;
    weekNumber: string | null;
};

type InstallationDataQuality = {
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

export type AccumulatedInstallationContainer = {
    accumulated: InstallationAccumulated[];
    dataQuality: InstallationDataQuality[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
