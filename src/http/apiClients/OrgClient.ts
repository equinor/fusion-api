import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Position from './models/org/Position';
import OrgProject from './models/org/OrgProject';

export default class OrgClient extends BaseApiClient {
    async getProjectAsync(projectId: string) {
        const url = this.resourceCollections.org.project(projectId);
        return await this.httpClient.getAsync<OrgProject, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    async getPositionsAsync(projectId: string) {
        const url = this.resourceCollections.org.positions(projectId);
        return await this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    async getPositionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.position(projectId, positionId);
        return await this.httpClient.getAsync<Position, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    async updatePositionAsync(projectId: string, position: Position) {
        const url = this.resourceCollections.org.position(projectId, position.id);
        return await this.httpClient.putAsync<Position, Position, FusionApiHttpErrorResponse>(
            url,
            position,
            {
                headers: {
                    'api-version': '2.0',
                },
            }
        );
    }

    async getRoleDescriptionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.roleDescription(projectId, positionId);
        return await this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return await response.text();
            }
        );
    }

    async getDisciplineNetworkAsync(projectId: string, discipline: string) {
        const url = this.resourceCollections.org.disciplineNetwork(projectId, discipline);
        return await this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url);
    }
}
