import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class OrgResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getOrgBaseUrl());
    }

    projects() {
        return combineUrls(this.getBaseUrl(), 'projects');
    }

    project(projectId: string, expandProperties?: string[]) {
        const url = combineUrls(this.getBaseUrl(), 'projects', projectId);
        if (!expandProperties || !expandProperties.length) return url;
        return `${url}?$expand=${expandProperties.join(',')}`;
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

    position(projectId: string, positionId: string, expand = true) {
        const url = combineUrls(this.positions(projectId), positionId);

        if (!expand) {
            return url;
        }

        const query = `?$expand=taskOwners.instances, reportsTo.instances, parentPosition, project, contract`;
        return `${url}${query}`;
    }

    instances(projectId: string, positionId: string, expandProperties?: string[]) {
        const url = combineUrls(this.position(projectId, positionId, false), 'instances');
        if (!expandProperties || !expandProperties.length) {
            return url;
        }
        const query = `?$expand=${expandProperties.join(',')}`;
        return `${url}${query}`;
    }

    instance(projectId: string, positionId: string, instanceId: string) {
        return combineUrls(this.instances(projectId, positionId), instanceId);
    }
    positionsDraft(projectId: string, draftId: string) {
        return combineUrls(this.project(projectId), 'drafts', draftId, 'positions');
    }
    positionDraft(projectId: string, positionId: string, draftId: string) {
        return combineUrls(this.positionsDraft(projectId, draftId), positionId);
    }

    publish(projectId: string, draftId: string) {
        return combineUrls(this.project(projectId), 'drafts', draftId, 'publish');
    }

    publishStatus(draftId: string) {
        return combineUrls(this.getBaseUrl(), 'drafts', draftId, 'publish');
    }

    deleteDraft(projectId: string, draftId: string) {
        return combineUrls(this.project(projectId), 'drafts', draftId);
    }

    roleDescriptionV2(projectId: string, positionId: string) {
        return combineUrls(this.position(projectId, positionId, false), 'role-description');
    }

    personalTaskDescription(projectId: string, azureUniqueId: string) {
        return combineUrls(
            this.getBaseUrl(),
            'persons',
            azureUniqueId,
            'role-descriptions',
            'projects',
            projectId,
            'content'
        );
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

    reportsTo(projectId: string, positionId: string, instanceId: string) {
        return combineUrls(
            this.position(projectId, positionId, false),
            'instances',
            instanceId,
            'reports-to'
        );
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
    contractPosition(projectId: string, contractId: string, positionId: string) {
        return combineUrls(this.getContractPositionsUrl(projectId, contractId), positionId);
    }

    projectImage(projectId: string) {
        return combineUrls(this.project(projectId), 'image');
    }

    snapshots(projectId: string) {
        return combineUrls(this.project(projectId), 'snapshots');
    }
    transientSnapshots(projectId: string) {
        return combineUrls(this.snapshots(projectId), 'transient');
    }
    snapshot(projectId: string, snapshotId: string) {
        return combineUrls(this.snapshots(projectId), snapshotId);
    }
    approveSnapshot(projectId: string, snapshotId: string) {
        return combineUrls(this.snapshot(projectId, snapshotId), 'approve');
    }
    snapshotBase(snapshotId: string) {
        return combineUrls(this.getBaseUrl(), 'snapshots', snapshotId);
    }
    snapshotProject(snapshotId: string, expandProperties?: string[]) {
        const url = combineUrls(this.snapshotBase(snapshotId), 'project');
        if (!expandProperties || !expandProperties.length) return url;
        return `${url}?$expand=${expandProperties.join(',')}`;
    }
    snapshotPositions(snapshotId: string, expandProperties?: string[]) {
        const url = combineUrls(this.snapshotBase(snapshotId), 'positions');

        if (!expandProperties || !expandProperties.length) {
            return url;
        }
        const expand = `?$expand=${expandProperties.join(',')}`;
        return `${url}${expand}`;
    }
    snapshotPosition(snapshotId: string, positionId: string) {
        return combineUrls(this.snapshotPositions(snapshotId), positionId);
    }
    snapshotRoleDescription(snapshotId: string, positionId: string) {
        return combineUrls(this.snapshotPosition(snapshotId, positionId), 'role-description');
    }
    snapshotReportsTo(snapshotId: string, positionId: string, instanceId: string) {
        return combineUrls(
            this.snapshotPosition(snapshotId, positionId),
            'instances',
            instanceId,
            'reports-to'
        );
    }
}
