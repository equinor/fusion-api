import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Contract from './models/org/Contract';
import OrgProject, {
    BasePosition,
    CreateOrgProject,
    PositionInstance,
    PublishDetails,
    PositionReportPath,
} from './models/org/OrgProject';
import Position from './models/org/Position';

export default class OrgClient extends BaseApiClient {
    public async getProjectsAsync() {
        const url = this.resourceCollections.org.projects();
        return this.httpClient.getAsync<OrgProject[], FusionApiHttpErrorResponse>(url);
    }

    public async getProjectAsync(projectId: string) {
        const url = this.resourceCollections.org.project(projectId);
        return this.httpClient.getAsync<OrgProject, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async searchProjectsAsync(query: string, apiVersion?: string) {
        const requestHeader: RequestInit = {
            headers: {
                'api-version': apiVersion ? apiVersion : '1.0',
            },
        };
        const url = this.resourceCollections.org.projectQuery(query);
        return this.httpClient.getAsync<OrgProject[], FusionApiHttpErrorResponse>(
            url,
            requestHeader
        );
    }

    public async newProjectAsync(newProject: CreateOrgProject) {
        const baseUrl = this.resourceCollections.org.projects();
        const url = `${baseUrl}?api-version=2.0`;

        return this.httpClient.postAsync<CreateOrgProject, OrgProject, FusionApiHttpErrorResponse>(
            url,
            newProject
        );
    }

    public async getPositionsAsync(projectId: string, expandProperties?: string[]) {
        const url = this.resourceCollections.org.positions(projectId, expandProperties);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async getPositionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.position(projectId, positionId);
        return this.httpClient.getAsync<Position, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async updatePositionAsync(projectId: string, position: Position, edit?: boolean) {
        const url = this.resourceCollections.org.position(projectId, position.id, false);
        return this.httpClient.putAsync<Position, Position, FusionApiHttpErrorResponse>(
            url,
            position,
            {
                headers: {
                    'api-version': '2.0',
                    'Content-Type': 'application/json',
                    'x-pro-edit-mode': edit ? 'true' : 'false',
                },
            }
        );
    }

    public async updatePositionPropertyAsync(
        projectId: string,
        positionId: string,
        positionProperties: Partial<Position>,
        edit?: boolean
    ) {
        const url = this.resourceCollections.org.position(projectId, positionId, false);
        return this.httpClient.patchAsync<Partial<Position>, Position, FusionApiHttpErrorResponse>(
            url,
            positionProperties,
            {
                headers: {
                    'api-version': '2.0',
                    'Content-Type': 'application/json',
                    'x-pro-edit-mode': edit ? 'true' : 'false',
                },
            }
        );
    }

    public async updateInstancePropertyAsync(
        projectId: string,
        positionId: string,
        instanceId: string,
        instanceProperties: Partial<PositionInstance> & { id: string },
        edit?: boolean
    ) {
        const url = this.resourceCollections.org.instance(projectId, positionId, instanceId);
        return this.httpClient.patchAsync<object, PositionInstance, FusionApiHttpErrorResponse>(
            url,
            instanceProperties,
            {
                headers: {
                    'api-version': '2.0',
                    'Content-Type': 'application/json',
                    'x-pro-edit-mode': edit ? 'true' : 'false',
                },
            }
        );
    }

    public async publishAsync(projectId: string, draftId: string, apiVersion?: string) {
        const url = this.resourceCollections.org.publish(projectId, draftId);
        const requestHeader: RequestInit = {
            headers: {
                'api-version': apiVersion ? apiVersion : '1.0',
            },
        };
        return this.httpClient.postAsync<null, PublishDetails, FusionApiHttpErrorResponse>(
            url,
            null,
            requestHeader
        );
    }

    public async getPublishStatusAsync(draftId: string, apiVersion?: string) {
        const url = this.resourceCollections.org.publishStatus(draftId);
        const requestHeader: RequestInit = {
            headers: {
                'api-version': apiVersion ? apiVersion : '1.0',
            },
        };
        return this.httpClient.getAsync<PublishDetails, FusionApiHttpErrorResponse>(
            url,
            requestHeader
        );
    }

    public async getPositionReportPathAsync(projectId: string, positionId: string, date: string){
        const url = this.resourceCollections.org.reportsTo(projectId, positionId, date);
        return this.httpClient.getAsync<PositionReportPath, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            }
        })

    }

    public async getRoleDescriptionAsync(projectId: string, positionId: string) {
        const url = this.resourceCollections.org.roleDescription(projectId, positionId);
        return this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return response.text();
            }
        );
    }

    public async getBasePositionRoleDescriptionAsync(basePositionId: string) {
        const url = this.resourceCollections.org.basePositionRoleDescription(basePositionId);
        return this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return response.text();
            }
        );
    }

    public async getDisciplineNetworkAsync(projectId: string, discipline: string) {
        const url = this.resourceCollections.org.disciplineNetwork(projectId, discipline);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url);
    }

    public async canEditPosition(projectId: string, positionId: string) {
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

    public async getDisciplines() {
        const url = this.resourceCollections.org.basePositions();

        try {
            const res = await this.httpClient.getAsync<BasePosition[], FusionApiHttpErrorResponse>(
                url
            );

            const disciplines = res.data.map(d => d.discipline);
            const distinct = disciplines.reduce((acc: string[], curr: string) => {
                if (curr && acc.indexOf(curr) === -1 && curr.trim().length > 0) {
                    acc.push(curr);
                }

                return acc;
            }, []);

            return distinct;
        } catch (error) {
            return false;
        }
    }

    public async getContractsAsync(projectId: string) {
        const url = this.resourceCollections.org.getContractsUrl(projectId);
        return this.httpClient.getAsync<Contract[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async getContractPositionsAsync(projectId: string, contractId: string) {
        const url = this.resourceCollections.org.getContractPositionsUrl(projectId, contractId);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    protected getBaseUrl() {
        return this.serviceResolver.getOrgBaseUrl();
    }
}
