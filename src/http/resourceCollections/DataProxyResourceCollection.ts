import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import {
    AccumulatedContainer,
    HandoverMcpkg,
    HandoverWorkOrder,
    HandoverUnsignedTask,
    HandoverUnsignedAction,
    HandoverPunch,
    HandoverSWCR,
    HandoverDetails,
    HandoverNCR,
    HandoverQuery,
} from '../apiClients/models/dataProxy';

export type AccumulatedActions = {
    mccr: AccumulatedContainer;
    punch: AccumulatedContainer;
    commpkg: AccumulatedContainer;
    productivity: AccumulatedContainer;
    womaterial: AccumulatedContainer;
    installation: AccumulatedContainer;
    earnedplanned: AccumulatedContainer;
};

export type HandoverActions = {
    mcpkg: HandoverMcpkg;
    'work-orders': HandoverWorkOrder;
    'unsigned-tasks': HandoverUnsignedTask;
    'unsigned-actions': HandoverUnsignedAction;
    punch: HandoverPunch;
    swcr: HandoverSWCR;
    details: HandoverDetails;
    ncr: HandoverNCR;
    query: HandoverQuery;
};

export default class DataProxyResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataProxyBaseUrl();
    }

    apiSignin(): string {
        return combineUrls(this.getBaseUrl(), 'api-signin');
    }

    handover(siteCode: string, projectIdentifier: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, 'handover');
    }

    handoverChildren(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string,
        action: keyof HandoverActions
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
        action: keyof AccumulatedActions
    ): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, `${action}-accumulated`);
    }

    milestones(contextId: string): string {
        return combineUrls(this.getBaseUrl(), `api/contexts/${contextId}/milestones`);
    }

    workOrders(contextId: string): string {
        return combineUrls(this.getBaseUrl(), `api/contexts/${contextId}/work-orders`);
    }

    workOrdersMaterials(contextId: string, workOrderId: string): string {
        return combineUrls(
            this.getBaseUrl(),
            `api/contexts/${contextId}/work-orders/${workOrderId}/material`
        );
    }
    workOrdersMccr(contextId: string, workOrderId: string): string {
        return combineUrls(
            this.getBaseUrl(),
            `api/contexts/${contextId}/work-orders/${workOrderId}/mccr`
        );
    }
}
