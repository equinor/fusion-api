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
import { HandoverActions, AccumulatedActions } from '../resourceCollections/DataProxyResourceCollection';

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
    AccumulatedActions
};

export default class DataProxyClient extends BaseApiClient {
    async getHandoverAsync(siteCode: string, projectIdentifier: string) {
        const url = this.resourceCollections.dataProxy.handover(siteCode, projectIdentifier);
        return await this.httpClient.getAsync<HandoverItem[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverChildrenAsync<T>(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string,
        action: keyof HandoverActions
    ) {
        const url = this.resourceCollections.dataProxy.handoverChildren(
            siteCode,
            projectIdentifier,
            commpkgId,
            action
        );
        return await this.httpClient.getAsync<T[], FusionApiHttpErrorResponse>(url);
    }

    async getAccumulatedItemAsync<T>(
        siteCode: string,
        projectIdentifier: string,
        action: keyof AccumulatedActions
    ) {
        const url = this.resourceCollections.dataProxy.accumulatedItem(
            siteCode,
            projectIdentifier,
            action
        );
        return await this.httpClient.getAsync<T[], FusionApiHttpErrorResponse>(url);
    }
}
