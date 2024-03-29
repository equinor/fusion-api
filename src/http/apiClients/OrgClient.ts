import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Contract from './models/org/Contract';
import OrgProject, {
    BasePosition,
    CreateOrgProject,
    PositionInstance,
    PublishDetails,
    PositionReportPath,
    RoleDescription,
    OrgSnapshot,
    ApproveSnapshotRequest,
    CreateSnapshotRequest,
    CreateTransientSnapshotRequest,
} from './models/org/OrgProject';
import Position from './models/org/Position';
import { HttpResponse } from '../HttpClient';

export default class OrgClient extends BaseApiClient {
    public async getProjectsAsync(): Promise<HttpResponse<OrgProject[]>> {
        const url = this.resourceCollections.org.projects();
        return this.httpClient.getAsync<OrgProject[], FusionApiHttpErrorResponse>(url);
    }

    public async getProjectAsync(
        projectId: string,
        snapshotId?: string,
        expand?: [keyof OrgProject]
    ): Promise<HttpResponse<OrgProject>> {
        const orgResources = this.resourceCollections.org;
        const url = snapshotId
            ? orgResources.snapshotProject(snapshotId, expand)
            : orgResources.project(projectId, expand);
        return this.httpClient.getAsync<OrgProject, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async searchProjectsAsync(
        query: string,
        apiVersion?: string
    ): Promise<HttpResponse<OrgProject[]>> {
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

    public async newProjectAsync(newProject: CreateOrgProject): Promise<HttpResponse<OrgProject>> {
        const baseUrl = this.resourceCollections.org.projects();
        const url = `${baseUrl}?api-version=2.0`;

        return this.httpClient.postAsync<CreateOrgProject, OrgProject, FusionApiHttpErrorResponse>(
            url,
            newProject
        );
    }

    public async getProjectImageAsync(args: { projectId: string }): Promise<File> {
        const { projectId } = args;
        const orgResources = this.resourceCollections.org;
        const url = orgResources.projectImage(projectId);
        return this.httpClient.getFileAsync<FusionApiHttpErrorResponse>(url);
    }

    public async updateProjectImageAsync(args: {
        projectId: string;
        file: File;
    }): Promise<Response> {
        const { projectId, file } = args;
        const orgResources = this.resourceCollections.org;
        const url = orgResources.projectImage(projectId);
        const requestInit: RequestInit = {
            headers: {
                'api-version': '2.0',
            },
        };
        return this.httpClient.uploadFileAsync<FusionApiHttpErrorResponse>(
            url,
            file,
            'PUT',
            requestInit
        );
    }

    public async deleteProjectImageAsync(projectId: string): Promise<HttpResponse<void>> {
        const orgResources = this.resourceCollections.org;
        const url = orgResources.projectImage(projectId);
        const requestHeader: RequestInit = {
            headers: {
                'api-version': '2.0',
            },
        };
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(
            url,
            requestHeader,
            () => Promise.resolve()
        );
    }

    public async getPositionsAsync(
        projectId: string,
        expandProperties?: string[],
        snapshotId?: string
    ): Promise<HttpResponse<Position[]>> {
        const orgResources = this.resourceCollections.org;

        const url = snapshotId
            ? orgResources.snapshotPositions(snapshotId, expandProperties)
            : orgResources.positions(projectId, expandProperties);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }
    public async getPositionsAllowHeaders(
        projectId: string,
        draftId?: string
    ): Promise<string | null> {
        const orgResources = this.resourceCollections.org;

        const url = draftId
            ? orgResources.positionsDraft(projectId, draftId)
            : orgResources.positions(projectId);

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
            return allowHeader;
        } catch (e) {
            return null;
        }
    }

    public async getPositionAsync(
        projectId: string,
        positionId: string,
        snapshotId?: string
    ): Promise<HttpResponse<Position>> {
        const orgResources = this.resourceCollections.org;

        const url = snapshotId
            ? orgResources.snapshotPosition(snapshotId, positionId)
            : orgResources.position(projectId, positionId);
        return this.httpClient.getAsync<Position, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async updatePositionAsync(
        projectId: string,
        position: Position,
        edit?: boolean
    ): Promise<HttpResponse<Position>> {
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
    ): Promise<HttpResponse<Position>> {
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
    ): Promise<HttpResponse<PositionInstance>> {
        const url = this.resourceCollections.org.instance(projectId, positionId, instanceId);
        return this.httpClient.patchAsync<
            Partial<PositionInstance> & { id: string },
            PositionInstance,
            FusionApiHttpErrorResponse
        >(url, instanceProperties, {
            headers: {
                'api-version': '2.0',
                'Content-Type': 'application/json',
                'x-pro-edit-mode': edit ? 'true' : 'false',
            },
        });
    }

    public async publishAsync(
        projectId: string,
        draftId: string,
        apiVersion?: string
    ): Promise<HttpResponse<PublishDetails>> {
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

    public async deleteDraftAsync(
        projectId: string,
        draftId: string,
        apiVersion?: string
    ): Promise<HttpResponse<void>> {
        const url = this.resourceCollections.org.deleteDraft(projectId, draftId);
        const requestHeader: RequestInit = {
            headers: {
                'api-version': apiVersion ? apiVersion : '1.0',
            },
        };
        return this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(
            url,
            requestHeader,
            () => Promise.resolve()
        );
    }

    public async getPublishStatusAsync(
        draftId: string,
        apiVersion?: string
    ): Promise<HttpResponse<PublishDetails>> {
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

    public async getPositionReportPathAsync(
        projectId: string,
        positionId: string,
        instanceId: string,
        snapshotId?: string
    ): Promise<HttpResponse<PositionReportPath>> {
        const orgResources = this.resourceCollections.org;

        const url = snapshotId
            ? orgResources.snapshotReportsTo(snapshotId, positionId, instanceId)
            : orgResources.reportsTo(projectId, positionId, instanceId);
        return this.httpClient.getAsync<PositionReportPath, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async getRoleDescriptionAsync(
        projectId: string,
        positionId: string
    ): Promise<HttpResponse<string>> {
        const url = this.resourceCollections.org.roleDescription(projectId, positionId);
        return this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return response.text();
            }
        );
    }

    public async getBasePositionRoleDescriptionAsync(
        basePositionId: string
    ): Promise<HttpResponse<string>> {
        const url = this.resourceCollections.org.basePositionRoleDescription(basePositionId);
        return this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            async (response: Response) => {
                return response.text();
            }
        );
    }

    public async getRoleDescriptionV2Async(
        projectId: string,
        positionId: string,
        snapshotId?: string
    ): Promise<HttpResponse<RoleDescription>> {
        const orgResources = this.resourceCollections.org;
        const url = snapshotId
            ? orgResources.snapshotRoleDescription(snapshotId, positionId)
            : orgResources.roleDescriptionV2(projectId, positionId);
        return this.httpClient.getAsync<RoleDescription, FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async updatePersonalTaskDescriptionAsync(
        projectId: string,
        azureUniqueId: string,
        description: string
    ): Promise<HttpResponse<string>> {
        const url = this.resourceCollections.org.personalTaskDescription(projectId, azureUniqueId);
        return this.httpClient.putAsync<() => string, string, FusionApiHttpErrorResponse>(
            url,
            () => description,
            {
                headers: {
                    'api-version': '2.0',
                    'Content-Type': 'text/plain',
                },
            },
            async (response: Response) => {
                return response.text();
            }
        );
    }

    public async canEditPersonalTaskDescriptionAsync(
        projectId: string,
        azureUniqueId: string
    ): Promise<boolean> {
        const url = this.resourceCollections.org.personalTaskDescription(projectId, azureUniqueId);
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

    public async getDisciplineNetworkAsync(
        projectId: string,
        discipline: string
    ): Promise<HttpResponse<Position[]>> {
        const url = this.resourceCollections.org.disciplineNetwork(projectId, discipline);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url);
    }

    public async canEditPosition(projectId: string, positionId: string): Promise<boolean> {
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
    public async getPositionAllowHeaders(
        projectId: string,
        positionId: string,
        draftId?: string
    ): Promise<string | null> {
        const orgResources = this.resourceCollections.org;

        const url = draftId
            ? orgResources.positionDraft(projectId, positionId, draftId)
            : orgResources.position(projectId, positionId, false);

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
            return allowHeader;
        } catch (e) {
            return null;
        }
    }

    public async getDisciplines(): Promise<false | string[]> {
        const url = this.resourceCollections.org.basePositions();

        try {
            const res = await this.httpClient.getAsync<BasePosition[], FusionApiHttpErrorResponse>(
                url
            );

            const disciplines = res.data.map((d) => d.discipline);
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

    public async getContractsAsync(projectId: string): Promise<HttpResponse<Contract[]>> {
        const url = this.resourceCollections.org.getContractsUrl(projectId);
        return this.httpClient.getAsync<Contract[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async getContractPositionsAsync(
        projectId: string,
        contractId: string
    ): Promise<HttpResponse<Position[]>> {
        const url = this.resourceCollections.org.getContractPositionsUrl(projectId, contractId);
        return this.httpClient.getAsync<Position[], FusionApiHttpErrorResponse>(url, {
            headers: {
                'api-version': '2.0',
            },
        });
    }

    public async getContractPositionAllowHeaderAsync(
        projectId: string,
        contractId: string,
        positionId: string
    ): Promise<string> {
        const url = this.resourceCollections.org.contractPosition(
            projectId,
            contractId,
            positionId
        );

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
            return allowHeader || '';
        } catch (e) {
            return '';
        }
    }

    public async deleteContractPositionAsync(
        projectId: string,
        contractId: string,
        positionId: string
    ): Promise<HttpResponse<void>> {
        const url = this.resourceCollections.org.contractPosition(
            projectId,
            contractId,
            positionId
        );
        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(
            url,
            {
                headers: {
                    'api-version': '2.0',
                },
            },
            () => Promise.resolve()
        );
    }

    public async canReadSnapshotsAsync(projectId: string): Promise<boolean> {
        const url = this.resourceCollections.org.snapshots(projectId);
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
            if (allowHeader !== null && allowHeader.toLowerCase().indexOf('get') !== -1) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }
    public async getSnapshotsAsync(projectId: string): Promise<HttpResponse<OrgSnapshot[]>> {
        const url = this.resourceCollections.org.snapshots(projectId);
        return await this.httpClient.getAsync<OrgSnapshot[], FusionApiHttpErrorResponse>(url);
    }

    public async getSnapshotAsync(
        projectId: string,
        snapshotId: string
    ): Promise<HttpResponse<OrgSnapshot>> {
        const url = this.resourceCollections.org.snapshot(projectId, snapshotId);
        return await this.httpClient.getAsync<OrgSnapshot, FusionApiHttpErrorResponse>(url);
    }

    public async canDeleteSnapshotsAsync(projectId: string, snapshotId: string): Promise<boolean> {
        const url = this.resourceCollections.org.snapshot(projectId, snapshotId);
        try {
            const response = await this.httpClient.optionsAsync<void, FusionApiHttpErrorResponse>(
                url,
                {},
                () => Promise.resolve()
            );

            const allowHeader = response.headers.get('Allow');
            if (allowHeader !== null && allowHeader.toLowerCase().indexOf('delete') !== -1) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }

    public async deleteSnapShotAsync(
        projectId: string,
        snapshotId: string
    ): Promise<HttpResponse<void>> {
        const url = this.resourceCollections.org.snapshot(projectId, snapshotId);
        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url, {}, () =>
            Promise.resolve()
        );
    }

    public async createSnapshotAsync(
        projectId: string,
        snapshotRequest: CreateSnapshotRequest
    ): Promise<HttpResponse<OrgSnapshot>> {
        const url = this.resourceCollections.org.snapshots(projectId);
        return await this.httpClient.postAsync<
            CreateSnapshotRequest,
            OrgSnapshot,
            FusionApiHttpErrorResponse
        >(url, snapshotRequest);
    }

    public async createTransientSnapshotAsync(
        projectId: string,
        snapshotRequest: CreateTransientSnapshotRequest
    ): Promise<HttpResponse<OrgSnapshot>> {
        const url = this.resourceCollections.org.transientSnapshots(projectId);
        return await this.httpClient.postAsync<
            CreateTransientSnapshotRequest,
            OrgSnapshot,
            FusionApiHttpErrorResponse
        >(url, snapshotRequest);
    }

    public async canApproveSnapshotAsync(projectId: string, snapshotId: string): Promise<boolean> {
        const url = this.resourceCollections.org.approveSnapshot(projectId, snapshotId);
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
            if (allowHeader !== null && allowHeader.indexOf('POST') !== -1) {
                return true;
            }

            return false;
        } catch (e) {
            return false;
        }
    }
    public async approveSnapshotAsync(
        projectId: string,
        snapshotId: string,
        approvePayload: ApproveSnapshotRequest
    ): Promise<HttpResponse<OrgSnapshot>> {
        const url = this.resourceCollections.org.approveSnapshot(projectId, snapshotId);
        return await this.httpClient.postAsync<
            ApproveSnapshotRequest,
            OrgSnapshot,
            FusionApiHttpErrorResponse
        >(url, approvePayload);
    }

    protected getBaseUrl(): string {
        return this.serviceResolver.getOrgBaseUrl();
    }
}
