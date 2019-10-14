type CommpkgAccumulated = {
    actualCountRFCC: number;
    actualCountRFOC: number;
    plannedCountRFCC: number;
    plannedCountRFOC: number;
    weekNumber: string | null;
};

type DataQualityCommpkg = {
    actualDate: string | null;
    commmpkgNumber: string | null;
    forecastDate: string | null;
    isPartly: boolean;
    milestone: string | null;
    order: number;
    plannedDate: string | null;
    projectIdentifier: string | null;
    rowKey: string | null;
    siteCode: string | null;
    updatedDate: string | null;
};

export type AccumulatedCommpkgContainer = {
    accumulated: CommpkgAccumulated[];
    dataQuality: DataQualityCommpkg[];
    dataQualityCount: number;
    projectIdentifier: string;
    siteCode: string;
    totalCount: number;
};
