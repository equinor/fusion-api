import useApiClient, { ApiClientHookResult } from '../useApiClient';
import {
    HandoverItem,
    HandoverActions,
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

export function useHanoverChild<TKey extends keyof HandoverActions, T = HandoverActions[TKey]>(
    siteCode: string,
    projectIdentifier: string,
    commpkgId: string,
    action: TKey
): ApiClientHookResult<T[]> {
    return useApiClient<T[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<TKey, T>(
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
