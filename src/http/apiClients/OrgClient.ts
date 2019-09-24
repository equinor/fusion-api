import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Position from './models/org/Position';
import OrgProject, { FusionProject } from './models/org/OrgProject';
import { combineUrls } from '../../utils/url';

export default class OrgClient extends BaseApiClient {
    async getProjectAsync(projectId: string) {
        const url = this.resourceCollections.org.project(projectId);
        return await this.httpClient.getAsync<OrgProject, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    async searchProjectsAsync(query: string) {
        const url = this.resourceCollections.org.projectQuery(query);
        return await this.httpClient.getAsync<FusionProject[], FusionApiHttpErrorResponse>(url);
    }

    async getPositionsAsync(projectId: string, expandProperties?: string[]) {
        const url = this.resourceCollections.org.positions(projectId, expandProperties);
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
        const url = this.resourceCollections.org.position(projectId, position.id, false);
        return await this.httpClient.putAsync<Position, void, FusionApiHttpErrorResponse>(
            url,
            position,
            {
                headers: {
                    'api-version': '2.0',
                    'Content-Type': 'application/json',
                },
            },
            () => Promise.resolve()
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

    async getBasePositionRoleDescriptionAsync(basePositionId: string) {
        const url = this.resourceCollections.org.basePositionRoleDescription(basePositionId);
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

    async canEditPosition(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.position(projectId, positionId, false);

        try {
            const response = await this.httpClient.optionsAsync<void, FusionApiHttpErrorResponse>(
                url,
                {
                    headers: {
                        'api-version': '2.0',
                    },
                },
                () => Promise.resolve()
            );

            const allowHeader = response.headers.get('Allow');
            if (allowHeader !== null && allowHeader.indexOf('PUT') !== -1) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }
}
