import useApiClient from "../useApiClient";
import { HandoverItem } from "../../apiClients/DataProxyClient";
import { HttpClientError } from "../../HttpClient";

export default (
    siteCode: string,
    projectIdentifier: string
): [HttpClientError | null, boolean, HandoverItem[] | null] => {
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
