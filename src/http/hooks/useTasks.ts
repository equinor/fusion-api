import { useState, useEffect } from "react";
import Task, { TaskSourceSystem } from "../apiClients/models/tasks/Task";
import useApiClients from "./useApiClients";
import useApiClient from "./useApiClient";

const useTaskSourceSystems = () => {
    return useApiClient(async apiClients => {
        var response = await apiClients.tasks.getSourceSystemsAsync();
        return response.data;
    }, []);
};

const useTaskTypes = () => {
    return useApiClient(async apiClients => {
        var response = await apiClients.tasks.getTaskTypesAsync();
        return response.data;
    }, []);
};

const useTaskPrioritySetter = () => {
    const apiClients = useApiClients();
    return async (id: string, priority: number) => {
        await apiClients.tasks.setTaskPriorityAsync(id, priority);
    };
};

export { useTaskSourceSystems, useTaskTypes, useTaskPrioritySetter };

export default () => {
    const [sourceSystemsError, isFetchingSourceSystems, sourceSystems] = useTaskSourceSystems();
    const [taskTypesError, isFetchingTaskTypes, taskTypes] = useTaskTypes();

    const [tasksError, isFetchingTasks, tasks] = useApiClient(
        async apiClients => {
            if (!taskTypes || !taskTypes.length) {
                return [];
            }

            const requests = taskTypes.map(taskType =>
                apiClients.tasks.getAllTasksAsync(taskType.key)
            );
            const responses = await Promise.all(requests);
            return responses.reduce<Task[]>((all, response) => [...all, ...response.data], []);
        },
        [taskTypes]
    );

    const error = sourceSystemsError || taskTypesError || tasksError;
    const isFetching = isFetchingTaskTypes || isFetchingTasks;

    return {
        error,
        isFetching,
        tasks: tasks || [],
        isFetchingTaskTypes,
        taskTypes,
        isFetchingSourceSystems,
        sourceSystems,
    };
};
