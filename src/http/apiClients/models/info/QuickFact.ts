export interface QuickFact {
    title:          string;
    anchor:         string;
    bodyMarkdown:   null;
    created:        string;
    createdBy:      CreatedBy;
    collectionPath: string;
    slug?:          string;
    contentUrl?:    string;
}

export interface CreatedBy {
    azureUniqueId: string;
    mail:          string;
    name:          string;
}
