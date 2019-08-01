import BaseResourceCollection from "./BaseResourceCollection";
import { combineUrls } from "../../utils/url";
import { TaskTypes } from "../apiClients/models/tasks/TaskType";

export default class TasksResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getTasksBaseUrl(), "tasks");
    }

    taskTypes() {
        return combineUrls(this.getBaseUrl(), "types");
    }

    sourceSystems() {
        return combineUrls(this.getBaseUrl(), "source-systems");
    }

    tasks(type: TaskTypes) {
        return combineUrls(this.taskTypes(), type, "all");
    }

    task(id: string) {
        return combineUrls(this.getBaseUrl(), id);
    }

    count(type: TaskTypes) {
        return combineUrls(this.taskTypes(), type, "count");
    }

    query(queryText: string) {
        return this.getBaseUrl() + `?${queryText}`;
    }

    priority(id: string) {
        return combineUrls(this.task(id), "priority");
    }
}
