import TaskType, { TaskTypes } from "./TaskType";
import TaskSourceSystem, { TaskSourceSystems } from "./SourceSystem";

type Person = {
    aadUniqueId: string;
    mail: string;
    name: string;
};

type Task = {
    id: string;
    type: TaskType;
    sourceSystem: TaskSourceSystem;
    priority: number;
    taskTypeKey: string;
    title: string;
    category: string;
    description: string;
    url: string;
    item: {
        type: string;
        Name: string;
        Description: string;
    };
    assignedTo: Person;
    forwardedTo?: Person;
    dueDate?: Date;
    createdDate: Date;
    lastSyncedDate: Date;
    isHidden: boolean;
    metadata: string[];
};

export { TaskType, TaskTypes, TaskSourceSystem, TaskSourceSystems };

export default Task;
