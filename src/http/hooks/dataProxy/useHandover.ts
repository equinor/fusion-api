import useApiClient, { ApiClientHookResult } from '../useApiClient';
import { HandoverItem, HandoverActions } from '../../apiClients/DataProxyClient';

export const useHandover = (
    context: string,
    invalidateCache: boolean
): ApiClientHookResult<HandoverItem[]> => {
    return useApiClient<HandoverItem[]>(
        async (apiClients) => {
            const response = await apiClients.dataProxy.getHandoverAsync(context, invalidateCache);
            return response.data;
        },
        [context, invalidateCache]
    );
};

export function useHandoverChild<TKey extends keyof HandoverActions, T = HandoverActions[TKey]>(
    context: string,
    commpkgId: string,
    action: TKey
): ApiClientHookResult<T[]> {
    return useApiClient<T[]>(
        async (apiClients) => {
            const response = await apiClients.dataProxy.getHandoverChildrenAsync<TKey, T>(
                context,
                commpkgId,
                action
            );
            return response.data;
        },
        [context, commpkgId]
    );
}
