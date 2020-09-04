type PublishDetails = {
    id: string;
    created: string;
    name: string;
    azureUniquePersonId: string;
    status: 'Authoring' | 'Publishing' | 'Published' | 'PublishFailed';
    description: string | null;
    projectId: string;
    publishStartDate: Date;
    publishCompletedDate: Date;
};

export default PublishDetails;
