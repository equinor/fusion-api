export type FeatureLogEntryRequest = {
    appKey: string | null;
    contextId: string | null;
    contextName: string | null;
    feature: string;
    featureVersion: string;
    payload: string | null;
    metadata: string | null;
    dateTimeUtc: string;
};

export type FeatureLogBatch = {
    sessionId: string;
    entries: FeatureLogEntryRequest[];
};