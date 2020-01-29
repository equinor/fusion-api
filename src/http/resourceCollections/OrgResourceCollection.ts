import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class OrgResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getOrgBaseUrl());
    }

    projects() {
        return combineUrls(this.getBaseUrl(), 'projects');
    }

    project(projectId: string) {
        return combineUrls(this.getBaseUrl(), 'projects', projectId);
    }

    projectQuery(query: string) {
        return combineUrls(this.getBaseUrl(), `projects?$search=${query}`);
    }

    positions(projectId: string, expandProperties?: string[]) {
        const url = combineUrls(this.getBaseUrl(), 'projects', projectId, 'positions');

        if (!expandProperties || !expandProperties.length) {
            return url;
        }
        const query = `?$expand=${expandProperties.join(',')}`;
        return `${url}${query}`;
    }

    position(projectId: string, positionId: string, expand: boolean = true) {
        const url = combineUrls(this.positions(projectId), positionId);

        if (!expand) {
            return url;
        }

        const query = `?$expand=taskOwners.instances, reportsTo.instances, parentPosition, project, contract`;
        return `${url}${query}`;
    }

    instances(projectId: string, positionId :string, expandProperties?: string[]) {
        const url = combineUrls(this.position(projectId, positionId, false), 'instances');
        if(!expandProperties || !expandProperties.length){
            return url;
        }
        const query = `?$expand=${expandProperties.join(',')}`;
        return `${url}${query}`;
    }

    instance(projectId: string,positionId: string, instanceId: string) {
        return combineUrls(this.instances(projectId, positionId), instanceId);
    }

    publish(projectId: string, draftId: string) {
        return combineUrls(this.project(projectId), 'drafts', draftId, 'publish')
    }

    publishStatus(draftId: string) {
        return combineUrls(this.getBaseUrl(), 'drafts', draftId, 'publish')
    }

    roleDescriptionV2(projectId: string, positionId: string) {
        return combineUrls(this.position(projectId, positionId, false), 'role-description');
    }

    personalTaskDescription(projectId: string, azureUniqueId: string) {
        return combineUrls(this.getBaseUrl(), 'persons', azureUniqueId,'role-descriptions', 'projects', projectId, 'content')
    }

    roleDescription(projectId: string, positionId: string) {
        return combineUrls(
            this.position(projectId, positionId, false),
            'roleDescription',
            'content'
        );
    }

    basePositions(): string {
        return combineUrls(this.getBaseUrl(), 'positions', 'basepositions');
    }

    basePositionRoleDescription(basePositionId: string) {
        return combineUrls(
            this.getBaseUrl(),
            'positions',
            'basepositions',
            basePositionId,
            'roleDescription',
            'content'
        );
    }

    reportsTo(projectId: string, positionId: string, date: string) {
        const url = combineUrls(this.position(projectId, positionId, false), 'reportsTo');
        return `${url}?date=${date}`;
    }

    disciplineNetwork(projectId: string, discipline: string) {
        const url = combineUrls(this.project(projectId), 'positions', 'networks');
        const query = `?discipline=${discipline}`;
        return `${url}${query}`;
    }

    getContractsUrl(projectId: string) {
        return combineUrls(this.getBaseUrl(), 'projects', projectId, 'contracts');
    }
    getContractPositionsUrl(projectId: string, contractId: string) {
        return combineUrls(this.getContractsUrl(projectId), contractId, 'positions');
    }
}
