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
}
