export type PimsTask = {
    id: string;
    title: string;
    category: string;
    url: string;
    createdDate: Date;
    isOverdue: boolean;
    daysOverdue: number;
    taskTypeKey: string;
};
