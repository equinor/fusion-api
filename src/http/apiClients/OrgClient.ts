import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Position from './models/org/Position';

export default class OrgClient extends BaseApiClient {
    async getPositionsAsync(projectId: string) {
        const url = this.resourceCollections.org.positions(projectId);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url);
    }
}
