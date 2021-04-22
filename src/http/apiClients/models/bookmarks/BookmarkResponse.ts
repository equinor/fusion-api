type AccountType = 'Consultant' | 'Employee' | 'External' | 'Local';
type AccountClassification = 'Unclassified' | 'Internal' | 'External';

type Person = {
    azureUniquePersonId: string;
    mail?: string;
    name: string;
    phoneNumber?: string;
    jobTitle?: string;
    accountType: AccountType;
    accountClassification: AccountClassification;
};
type Context = {
    id: string;
    name: string;
};
type BookmarkResponse = {
    id: string;
    name: string;
    description?: string;
    isShared: boolean;
    appKey: string;
    context?: Context;
    payload: unknown;
    createdBy: Person;
};
export default BookmarkResponse;
