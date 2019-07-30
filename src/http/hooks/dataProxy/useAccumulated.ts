import useApiClient, { ApiClientHookResult } from '../useApiClient';
import { AccumulatedContainer } from '../../apiClients/DataProxyClient';

type Actions = {
    mccr: AccumulatedContainer;
    punch: AccumulatedContainer;
    commpkg: AccumulatedContainer;
    productivity: AccumulatedContainer;
    womaterial: AccumulatedContainer;
    installation: AccumulatedContainer;
    earnedplanned: AccumulatedContainer;
};

export function useAccumulatedItem<TKey extends keyof Actions, T = Actions[TKey]>(
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
