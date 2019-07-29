import useApiClient, { ApiClientHookResult } from '../useApiClient';
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
} from '../../apiClients/DataProxyClient';

export const useHandover = (
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverMcpkg>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'mcpkg'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverWorkOrder>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'work-orders'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<
                HandoverUnsignedTask
            >(siteCode, projectIdentifier, commpkgId, 'unsigned-tasks');
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<
                HandoverUnsignedAction
            >(siteCode, projectIdentifier, commpkgId, 'unsigned-actions');
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverPunch>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'punch'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverSWCR>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'swcr'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverDetails>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'details'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverNCR>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'ncr'
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
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<HandoverQuery>(
                siteCode,
                projectIdentifier,
                commpkgId,
                'query'
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};
