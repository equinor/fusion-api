export type PimsTask = {
    id: string;
    title: string;
    category: string;
    url: string;
    createdDate: Date;
    isOverdue: boolean;
    daysOverdue?: number;
    daysUntilDue?: number;
    taskTypeKey: string;
    targetDate?: Date;
    deadlineDate?: Date;
};
