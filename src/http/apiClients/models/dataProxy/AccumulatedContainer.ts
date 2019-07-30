export type AccumulatedContainer = {
    siteCode: string,
    projectIdentifier: string,
    totalCount: number,
    startDate?: string,
    dataQualityCount: number,
    dataQuality: string[],
    accumulated: string[]
}