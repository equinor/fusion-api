import buildQuery from "odata-query";
import BaseResourceCollection from "./BaseResourceCollection";
import combineUrls from "../../utils/combineUrls";
import { ContextType } from "../apiClients/models/context";

export default class ContextResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getContextBaseUrl();
    }

    contexts() {
        return combineUrls(this.getBaseUrl(), "contexts");
    }

    context(id: string) {
        return combineUrls(this.contexts(), id);
    }

    queryContexts(query: string, type: ContextType | null = null) {
        const baseUrl = this.contexts();

        const oDataQuery = buildQuery({
            filter: {
                "type.id": type,
            },
            search: query,
        });

        return `${baseUrl}${oDataQuery}`;
    }

    relatedContexts(id: string, type: ContextType | null = null) {
        const oDataQuery = buildQuery({
            filter: {
                type,
            },
        });

        return combineUrls(this.context(id), `related${oDataQuery}`);
    }
}
