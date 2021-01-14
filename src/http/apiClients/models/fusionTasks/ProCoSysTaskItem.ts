export type ProCoSysTask = {
    id: string;
    siteCode: string;
    projectIdentifier: string;
    todo: string;
    todoDescription: string;
    category: string;
    title: string;
    description: string;
    username: string;
    url: string;
    userGroup: string;
    responsibilityType: string;
    dueDate?: Date;
    subCategory: string;
    taskTypeKey: string;
    projectDescription: string;
};
