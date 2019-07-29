import BaseResourceCollection from './BaseResourceCollection';

export type HandoverActions =
    | 'mcpkg'
    | 'work-orders'
    | 'unsigned-tasks'
    | 'unsigned-actions'
    | 'punch'
    | 'swcr'
    | 'details'
    | 'ncr'
    | 'query';

export type AccumulatedActions =
    | 'mccr'
    | 'punch'
    | 'commpkg'
    | 'productivity'
    | 'womaterial'
    | 'installation'
    | 'earnedplanned';
export default class DataProxyResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataProxyBaseUrl();
    }

    handover(siteCode: string, projectIdentifier: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, 'handover');
    }

    handoverChildren(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string,
        action: HandoverActions
    ): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/${action}/`
        );
    }

    accumulatedItem(
        siteCode: string,
        projectIdentifier: string,
        action: AccumulatedActions
    ): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, `${action}-accumulated`);
    }
}
