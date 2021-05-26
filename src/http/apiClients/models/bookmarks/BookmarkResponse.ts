export type AccountType = 'Consultant' | 'Employee' | 'External' | 'Local';
export type AccountClassification = 'Unclassified' | 'Internal' | 'External';

export type Person = {
    azureUniqueId: string;
    mail?: string;
    name: string;
    phoneNumber?: string;
    jobTitle?: string;
    accountType: AccountType;
    accountClassification: AccountClassification;
};
export type Context = {
    id: string;
    name: string;
    type: string;
};
export type BookmarkResponse = {
    id: string;
    name: string;
    description?: string;
    isShared: boolean;
    appKey: string;
    context?: Context;
    payload: unknown;
    createdBy: Person;
    created: Date;
    updated?: Date | null;
};
export default BookmarkResponse;
