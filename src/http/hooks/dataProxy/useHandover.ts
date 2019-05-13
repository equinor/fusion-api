import useApiClient from "../useApiClient";
import { HandoverItem } from "../../apiClients/DataProxyClient";

export default (siteCode: string, projectIdentifier: string): [boolean, HandoverItem[] | null] => {
    return useApiClient<HandoverItem[]>(async apiClients => {
        const response = await apiClients.dataProxy.getHandoverAsync(siteCode, projectIdentifier);
        return response.data;
    }, [siteCode, projectIdentifier]);
};