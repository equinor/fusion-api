import useApiClient, { ApiClientHookResult } from "../useApiClient";
import {
    HandoverItem,
    HandoverMcpkg,
    HandoverWorkOrder,
    HandoverDetails,
    HandoverNCR,
    HandoverPunch,
    HandoverQuery,
    HandoverSWCR,
    HandoverUnsignedAction,
    HandoverUnsignedTask,
} from "../../apiClients/DataProxyClient";

export default (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<HandoverItem[]> => {
    return useApiClient<HandoverItem[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverAsync(
                siteCode,
                projectIdentifier
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverMcpkgs = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverMcpkg[]> => {
    return useApiClient<HandoverMcpkg[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverMcpkgAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverWorkOrders = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverWorkOrder[]> => {
    return useApiClient<HandoverWorkOrder[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverWorkOrdersAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverUnsignedTasks = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverUnsignedTask[]> => {
    return useApiClient<HandoverUnsignedTask[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverUnsignedTasksAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverUnsignedActions = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverUnsignedAction[]> => {
    return useApiClient<HandoverUnsignedAction[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverUnsignedActionsAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverPunch = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverPunch[]> => {
    return useApiClient<HandoverPunch[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverPunchAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverSWCR = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverSWCR[]> => {
    return useApiClient<HandoverSWCR[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverSWCRAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverDetails = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverDetails> => {
    return useApiClient<HandoverDetails>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverDetailsAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data[0];
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverNCR = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverNCR[]> => {
    return useApiClient<HandoverNCR[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverNCRAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useHandoverQuery = (
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string
): ApiClientHookResult<HandoverQuery[]> => {
    return useApiClient<HandoverQuery[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverQueryAsync(
                siteCode,
                projectIdentifier,
                commpkgId
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};
