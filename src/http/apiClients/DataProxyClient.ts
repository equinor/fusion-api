import { HttpResponse } from "../HttpClient";
import BaseApiClient from "./BaseApiClient";
import { FusionApiHttpErrorResponse } from "./models/common/FusionApiHttpErrorResponse";
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
} from "./models/dataProxy";

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
};

export default class DataProxyClient extends BaseApiClient {
    async getHandoverAsync(siteCode: string, projectIdentifier: string) {
        const url = this.resourceCollections.dataProxy.handover(siteCode, projectIdentifier);
        return await this.httpClient.getAsync<HandoverItem[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverMcpkgAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverMcpkgs(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverMcpkg[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverWorkOrdersAsync(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string
    ) {
        const url = this.resourceCollections.dataProxy.handoverWorkOrders(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverWorkOrder[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverUnsignedTasksAsync(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string
    ) {
        const url = this.resourceCollections.dataProxy.handoverUnsignedTasks(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverUnsignedTask[], FusionApiHttpErrorResponse>(
            url
        );
    }

    async getHandoverUnsignedActionsAsync(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string
    ) {
        const url = this.resourceCollections.dataProxy.handoverUnsignedActions(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverUnsignedAction[], FusionApiHttpErrorResponse>(
            url
        );
    }

    async getHandoverPunchAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverPunch(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverPunch[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverSWCRAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverSWCR(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverSWCR[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverDetailsAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverDetails(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverDetails[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverNCRAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverNCR(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverNCR[], FusionApiHttpErrorResponse>(url);
    }

    async getHandoverQueryAsync(siteCode: string, projectIdentifier: string, commpkgId: string) {
        const url = this.resourceCollections.dataProxy.handoverQuery(
            siteCode,
            projectIdentifier,
            commpkgId
        );
        return await this.httpClient.getAsync<HandoverQuery[], FusionApiHttpErrorResponse>(url);
    }
}
