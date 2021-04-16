export type Bookmark = {
    name: string;
    description?: string;
    isShared: boolean;
    appKey: string;
    contextId?: string;
    payload: unknown;
    delegatedOwners: DelegatedOwner[];
};
export type DelegatedOwner = {
    azureUniqueId: string;
    mail?: string;
};
