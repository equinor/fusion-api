import TaskType from "./TaskType";

export enum TaskSourceSystems {
    PimsDC,
    PimsRisk,
    ProCoSys,
    PortalActions,
}

type TaskSourceSystem = {
    key: string;
    displayName: string;
    sourceControlsPriority: boolean;
    handlesPortalTaskTypes: TaskType[];
}

export default TaskSourceSystem;