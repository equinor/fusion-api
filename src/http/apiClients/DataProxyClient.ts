import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import {
    HandoverItem,
    HandoverMcpkg,
    HandoverDetails,
    HandoverNCR,
    HandoverPunch,
    HandoverSWCR,
    HandoverUnsignedAction,
    HandoverUnsignedTask,
    HandoverWorkOrder,
    HandoverQuery,
    AccumulatedContainer,
    WorkOrder,
    WorkOrderMaterial,
    WorkOrderMccr,
    Milestone,
} from './models/dataProxy';
import {
    HandoverActions,
    AccumulatedActions,
} from '../resourceCollections/DataProxyResourceCollection';
import { HttpResponse } from '../HttpClient';

// Export models
export {
    HandoverItem,
    HandoverMcpkg,
    HandoverDetails,
    HandoverNCR,
    HandoverPunch,
    HandoverSWCR,
    HandoverUnsignedAction,
    HandoverUnsignedTask,
    HandoverWorkOrder,
    HandoverQuery,
    AccumulatedContainer,
    HandoverActions,
    AccumulatedActions,
};

export default class DataProxyClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getDataProxyBaseUrl();
    }

    async getHandoverAsync(siteCode: string, projectIdentifier: string) {
        const url = this.resourceCollections.dataProxy.handover(siteCode, projectIdentifier);
        return await this.httpClient.getAsync<HandoverItem[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverChildrenAsync<TKey extends keyof HandoverActions, T = HandoverActions[TKey]>(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string,
        action: TKey
    ): Promise<HttpResponse<T[]>> {
        const url = this.resourceCollections.dataProxy.handoverChildren(
            siteCode,
            projectIdentifier,
            commpkgId,
            action
        );
        return await this.httpClient.getAsync<T[], FusionApiHttpErrorResponse>(url);
    }

    async getAccumulatedItemAsync<
        TKey extends keyof AccumulatedActions,
        T = AccumulatedActions[TKey]
    >(siteCode: string, projectIdentifier: string, action: TKey): Promise<HttpResponse<T[]>> {
        const url = this.resourceCollections.dataProxy.accumulatedItem(
            siteCode,
            projectIdentifier,
            action
        );
        return await this.httpClient.getAsync<T[], FusionApiHttpErrorResponse>(url);
    }

    async getMilestonesAsync(contextId: string) {
        const url = this.resourceCollections.dataProxy.milestones(contextId);
        return await this.httpClient.getAsync<Milestone[], FusionApiHttpErrorResponse>(url);
    }

    async getWorkOrdersAsync(contextId: string, invalidateCache: boolean) {
        const url = this.resourceCollections.dataProxy.workOrders(contextId);
        const options = invalidateCache ? { headers: { 'x-pp-cache-policy': 'no-cache' } } : {};
        return await this.httpClient.getAsync<WorkOrder[], FusionApiHttpErrorResponse>(
            url,
            options
        );
    }

    async getWorkOrderMaterialsAsync(contextId: string, workOrderId: string) {
        const url = this.resourceCollections.dataProxy.workOrdersMaterials(contextId, workOrderId);
        return await this.httpClient.getAsync<WorkOrderMaterial[], FusionApiHttpErrorResponse>(url);
    }

    async getWorkOrderMccrAsync(contextId: string, workOrderId: string) {
        const url = this.resourceCollections.dataProxy.workOrdersMccr(contextId, workOrderId);
        return await this.httpClient.getAsync<WorkOrderMccr[], FusionApiHttpErrorResponse>(url);
    }
}
