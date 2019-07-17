import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
import Task, { TaskSourceSystem, TaskType, TaskTypes } from "./models/tasks/Task";

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
        const response = await this.httpClient.getStringAsync<FusionApiHttpErrorResponse>(url);
        return parseInt(response.data, 10);
    }

    async queryTasksAsync(queryText: string) {
        const url = this.resourceCollections.tasks.query(queryText);
        return this.httpClient.getAsync<Task[], FusionApiHttpErrorResponse>(url);
    }

    async setTaskPriorityAsync(id: string, priority: number) {
        const url = this.resourceCollections.tasks.priority(id, priority);
        await this.httpClient.putAsync<null, Task[], FusionApiHttpErrorResponse>(url, null);
    }
    
    async refreshTasksAsync(type: TaskTypes, refreshRequest: RequestInit) {
        const url = this.resourceCollections.tasks.tasks(type);
        return this.httpClient.getAsync<Task[], FusionApiHttpErrorResponse>(url, refreshRequest);
    }
}
