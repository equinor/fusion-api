import BaseResourceCollection from './BaseResourceCollection';
import {
    HandoverMcpkg,
    HandoverWorkOrder,
    HandoverUnsignedTask,
    HandoverUnsignedAction,
    HandoverPunch,
    HandoverSWCR,
    HandoverDetails,
    HandoverNCR,
    HandoverQuery,
    AccumulatedMCCRContainer,
    AccumulatedCommpkgContainer,
    AccumulatedPunchContainer,
    AccumulatedProductivityContainer,
    AccumulatedWOMaterialContainer,
    AccumulatedInstallationContainer,
    AccumulatedEarnedPlannedContainer,
} from '../apiClients/models/dataProxy';

export type AccumulatedActions = {
    mccr: AccumulatedMCCRContainer;
    punch: AccumulatedPunchContainer;
    commpkg: AccumulatedCommpkgContainer;
    productivity: AccumulatedProductivityContainer;
    womaterial: AccumulatedWOMaterialContainer;
    installation: AccumulatedInstallationContainer;
    earnedplanned: AccumulatedEarnedPlannedContainer;
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
}
