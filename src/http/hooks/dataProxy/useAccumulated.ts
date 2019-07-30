import useApiClient, { ApiClientHookResult } from '../useApiClient';
import { AccumulatedActions } from '../../apiClients/DataProxyClient';

export function useAccumulatedItem<TKey extends keyof AccumulatedActions, T = AccumulatedActions[TKey]>(
    siteCode: string,
    projectIdentifier: string,
    action: TKey
): ApiClientHookResult<T[]> {
    return useApiClient<T[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<T>(
                siteCode,
                projectIdentifier,
                action
            );
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
}
