import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Task, { TaskSourceSystem, TaskType, TaskTypes } from './models/tasks/Task';

export default class TasksClient extends BaseApiClient {
    async getSourceSystemsAsync() {
        const url = this.resourceCollections.tasks.sourceSystems();
        return this.httpClient.getAsync<TaskSourceSystem[], FusionApiHttpErrorResponse>(url);
    }

    async getTaskTypesAsync() {
        const url = this.resourceCollections.tasks.taskTypes();
        return this.httpClient.getAsync<TaskType[], FusionApiHttpErrorResponse>(url);
    }

    async getAllTasksAsync(type: TaskTypes) {
        const url = this.resourceCollections.tasks.tasks(type);
        return this.httpClient.getAsync<Task[], FusionApiHttpErrorResponse>(url);
    }

    async getTaskCountAsync(type: TaskTypes) {
        const url = this.resourceCollections.tasks.tasks(type);
        return await this.httpClient.getAsync<number, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                const responseText = await response.text();
                return parseInt(responseText, 10);
            }
        );
    }

    async queryTasksAsync(queryText: string) {
        const url = this.resourceCollections.tasks.query(queryText);
        return this.httpClient.getAsync<Task[], FusionApiHttpErrorResponse>(url);
    }

    async setTaskPriorityAsync(id: string, priority: number) {
        const url = this.resourceCollections.tasks.priority(id);
        await this.httpClient.patchAsync<number, void, FusionApiHttpErrorResponse>(
            url,
            priority,
            null,
            async () => await Promise.resolve()
        );
    }

    async refreshTasksAsync(type: TaskTypes, refreshRequest: RequestInit) {
        const url = this.resourceCollections.tasks.tasks(type);
        return this.httpClient.getAsync<Task[], FusionApiHttpErrorResponse>(url, refreshRequest);
    }
}
