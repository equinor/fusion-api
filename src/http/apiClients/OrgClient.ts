import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Position from './models/org/Position';

export default class OrgClient extends BaseApiClient {
    async getPositionsAsync(projectId: string) {
        const url = this.resourceCollections.org.positions(projectId);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url);
    }

    async getPositionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.position(projectId, positionId);
        return this.httpClient.getAsync<Position, FusionApiHttpErrorResponse>(url);
    }

    async getJobDescriptionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.jobDescription(projectId, positionId);
        return this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return await response.text();
            }
        );
    }
}
