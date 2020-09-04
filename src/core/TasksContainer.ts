import ApiClients from '../http/apiClients';
import TasksClient from '../http/apiClients/TasksClient';
import EventEmitter, { useEventEmitterValue, EventHandlerParameter } from '../utils/EventEmitter';
import Task, { TaskType, TaskSourceSystem, TaskTypes } from '../http/apiClients/models/tasks/Task';
import { useState, useEffect } from 'react';
import { useFusionContext } from './FusionContext';
import DistributedState, { IDistributedState } from '../utils/DistributedState';
import { IEventHub } from '../utils/EventHub';

type TasksEvents = {
    'tasks-updated': (tasks: Task[]) => void;
    'task-types-updated': (taskTypes: TaskType[]) => void;
    'source-systems-updated': (sourceSystems: TaskSourceSystem[]) => void;
};

export default class TasksContainer extends EventEmitter<TasksEvents> {
    private tasksClient: TasksClient;

    private tasks: IDistributedState<Task[]>;

    private taskTypes: IDistributedState<TaskType[]>;
    private sourceSystems: IDistributedState<TaskSourceSystem[]>;

    constructor(apiClients: ApiClients, eventHub: IEventHub) {
        super();
        this.tasks = new DistributedState<Task[]>('TaskContainer.Tasks', [], eventHub);
        this.tasks.on('change', (tasks: Task[]) => {
            this.emit('tasks-updated', tasks);
        });

        this.taskTypes = new DistributedState<TaskType[]>('TaskContainer.TaskTypes', [], eventHub);
        this.taskTypes.on('change', (taskTypes: TaskType[]) => {
            this.emit('task-types-updated', taskTypes);
        });

        this.sourceSystems = new DistributedState<TaskSourceSystem[]>(
            'TaskContainer.SourceSysytems',
            [],
            eventHub
        );
        this.sourceSystems.on('change', (sourceSystems: TaskSourceSystem[]) => {
            this.emit('source-systems-updated', sourceSystems);
        });

        this.tasksClient = apiClients.tasks;
    }

    async getAllTasksAsync() {
        const taskTypes = await this.getTaskTypesAsync();

        const taskPromises = taskTypes.map((taskType) => this.getTasksAsync(taskType.key));
        await Promise.all(taskPromises);
        return this.tasks.state;
    }

    async getTasksAsync(taskType: TaskTypes) {
        const response = await this.tasksClient.getAllTasksAsync(taskType);
        this.mergeTasks(response.data);

        if (response.refreshRequest) {
            return await this.refreshTasksAsync(taskType, response.refreshRequest);
        }

        return response.data;
    }

    async getTaskTypesAsync() {
        const response = await this.tasksClient.getTaskTypesAsync();
        this.setTaskTypes(response.data);
        return response.data;
    }

    async getSourceSystemsAsync() {
        const response = await this.tasksClient.getSourceSystemsAsync();
        this.setSourceSystems(response.data);
        return response.data;
    }

    async setTaskPriorityAsync(id: string, priority: number) {
        const task = this.getTasks().find((t) => t.id === id);

        if (!task) {
            throw new Error("Can't find the task with id: " + id);
        }

        const previousPriority = task.priority;

        try {
            // Immediately update the priority on the task for quick UI response
            const updatedTask = {
                ...task,
                priority,
            };
            this.mergeTasks([updatedTask]);

            await this.tasksClient.setTaskPriorityAsync(id, priority);
        } catch (e) {
            // Revert the task priority if it failed
            const revertedTask = {
                ...task,
                priority: previousPriority,
            };

            this.mergeTasks([revertedTask]);
        }
    }

    getTasks(taskType?: TaskTypes) {
        if (!taskType) {
            return [...this.tasks.state];
        }

        return this.tasks.state.filter((t) => t.taskTypeKey == taskType);
    }

    getTaskTypes() {
        return [...this.taskTypes.state];
    }

    getSourceSystems() {
        return [...this.sourceSystems.state];
    }

    private async refreshTasksAsync(taskType: TaskTypes, refreshRequest: RequestInit) {
        const response = await this.tasksClient.refreshTasksAsync(taskType, refreshRequest);
        this.mergeTasks(response.data);
        return response.data;
    }

    private mergeTasks(tasks: Task[]) {
        // Extract new tasks from the list of tasks
        const newTasks = tasks.filter((t) => !this.tasks.state.find((e) => e.id === t.id));

        // Merge new tasks with the existing
        const mergedTasks = [...this.tasks.state, ...newTasks];

        // Overwrite existing tasks with updated tasks
        this.tasks.state = mergedTasks.map((t) => tasks.find((n) => n.id === t.id) || t);
        this.emit('tasks-updated', this.tasks.state);
    }

    private setTaskTypes(taskTypes: TaskType[]) {
        this.taskTypes.state = taskTypes;
        this.emit('task-types-updated', taskTypes);
    }

    private setSourceSystems(sourceSystems: TaskSourceSystem[]) {
        this.sourceSystems.state = sourceSystems;
        this.emit('source-systems-updated', sourceSystems);
    }
}

const useTasksContainer = () => {
    const { tasksContainer } = useFusionContext();
    return tasksContainer;
};

const useTasksData = <
    TKey extends keyof TasksEvents,
    TData = EventHandlerParameter<TasksEvents, TKey>
>(
    event: TKey,
    fetchAsync: (tasksContainer: TasksContainer) => Promise<TData>,
    defaultData: TData
): [Error | null, boolean, TData] => {
    const tasksContainer = useTasksContainer();
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [defaultDataState] = useState<TData>(defaultData);

    const [data, setData] = useEventEmitterValue(tasksContainer, event, (t) => t, defaultDataState);

    const fetch = async () => {
        setIsFetching(true);

        try {
            const data = await fetchAsync(tasksContainer);
            setData(data);
        } catch (e) {
            setError(e);
        }

        setIsFetching(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    return [error, isFetching, data || defaultDataState];
};

const useTaskSourceSystems = () => {
    return useTasksData(
        'source-systems-updated',
        async (tasksContainer) => await tasksContainer.getSourceSystemsAsync(),
        useTasksContainer().getSourceSystems()
    );
};

const useTaskTypes = () => {
    return useTasksData(
        'task-types-updated',
        async (tasksContainer) => await tasksContainer.getTaskTypesAsync(),
        useTasksContainer().getTaskTypes()
    );
};

const useTaskPrioritySetter = () => {
    const { tasksContainer } = useFusionContext();
    return async (id: string, priority: number) => {
        await tasksContainer.setTaskPriorityAsync(id, priority);
    };
};

const useTasks = () => {
    const [sourceSystemsError, isFetchingSourceSystems, sourceSystems] = useTaskSourceSystems();
    const [taskTypesError, isFetchingTaskTypes, taskTypes] = useTaskTypes();

    const [tasksError, isFetchingTasks, tasks] = useTasksData(
        'tasks-updated',
        async (tasksContainer) => await tasksContainer.getAllTasksAsync(),
        useTasksContainer().getTasks()
    );

    const error = sourceSystemsError || taskTypesError || tasksError;
    const isFetching = isFetchingTaskTypes || isFetchingTasks;

    return {
        error,
        isFetching,
        tasks,
        isFetchingTaskTypes,
        taskTypes,
        isFetchingSourceSystems,
        sourceSystems,
    };
};

export { useTasksContainer, useTasks, useTaskSourceSystems, useTaskTypes, useTaskPrioritySetter };
