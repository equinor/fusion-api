export enum TaskTypes {
    MeetingAction = "MeetingAction",
    DocumentReview = "DocumentReview",
    TechnicalQuery = "TechnicalQuery",
    Risk = "Risk"
}

type TaskType = {
    key: TaskTypes,
    displayName: string;
    singularName: string;
};

export default TaskType;