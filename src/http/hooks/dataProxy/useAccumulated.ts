import useApiClient, { ApiClientHookResult } from '../useApiClient';
import { AccumulatedContainer } from '../../apiClients/DataProxyClient';

export const useAccumulatedMccr = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'mccr');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedPunch = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'punch');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedCommpkg = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'commpkg');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedProductivity = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'productivity');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedWOWithMaterial = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'womaterial');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedInstallation = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'installation');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};

export const useAccumulatedEarnedAndPlanned = (
    siteCode: string,
    projectIdentifier: string
): ApiClientHookResult<AccumulatedContainer[]> => {
    return useApiClient<AccumulatedContainer[]>(
        async apiClients => {
            const response = await apiClients.dataProxy.getAccumulatedItemAsync<
                AccumulatedContainer
            >(siteCode, projectIdentifier, 'earnedplanned');
            return response.data;
        },
        [siteCode, projectIdentifier]
    );
};
