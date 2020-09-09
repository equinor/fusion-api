export type QuickFact = {
    anchor: string;
    title?: string | null;
    bodyMarkdown?: string | null;
    collectionPath?: string | null;
    created: Date;
    createdBy: Person;
    updated?: Date | null;
    updatedBy?: Person | null;
};

export type Person = {
    azureUniqueId: string;
    mail?: string | null;
    name?: string | null;
};
