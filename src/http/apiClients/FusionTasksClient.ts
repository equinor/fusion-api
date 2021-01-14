import { FusionApiHttpErrorResponse } from '.';
import { HttpResponse } from '../HttpClient';
import BaseApiClient from './BaseApiClient';
import { PimsTask, ProcosysTask } from './models/fusionTasks';

export default class FusionTasksClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getPimsTasksAsync(
        personId: string,
        sourceSystem: string
    ): Promise<HttpResponse<PimsTask[]>> {
        const url = this.resourceCollections.fusionTasks.pimsTasks(personId, sourceSystem);
        return await this.httpClient.getAsync<PimsTask[], FusionApiHttpErrorResponse>(url);
    }

    async getProcosysTasksAsync(personId: string): Promise<HttpResponse<ProcosysTask[]>> {
        const url = this.resourceCollections.fusionTasks.procosysTasks(personId);
        return await this.httpClient.getAsync<ProcosysTask[], FusionApiHttpErrorResponse>(url);
    }
}
