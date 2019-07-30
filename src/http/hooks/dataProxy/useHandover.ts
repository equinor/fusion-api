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

type Actions = {
    "mcpkg": HandoverMcpkg,
    "work-orders": HandoverWorkOrder,
    "unsigned-tasks": HandoverUnsignedTask,
    "unsigned-actions": HandoverUnsignedAction,
    "punch": HandoverPunch,
    "swcr": HandoverSWCR,
    "details": HandoverDetails,
    "ncr": HandoverNCR,
    "query": HandoverQuery
}

export function useHanoverChild<TKey extends keyof Actions, T = Actions[TKey]>(
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string,
    action: TKey
): ApiClientHookResult<T[]> {
    return useApiClient<T[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<T>(
                siteCode,
                projectIdentifier,
                commpkgId,
                action
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
}
