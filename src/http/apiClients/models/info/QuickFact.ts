export type QuickFact = {
    title: string;
    anchor: string;
    bodyMarkdown: string | null;
    created: string;
    createdBy: CreatedBy;
    collectionPath: string;
    slug?: string;
    contentUrl?: string;
};

export type CreatedBy = {
    azureUniqueId: string;
    mail: string;
    name: string;
};
