import buildQuery from "odata-query";
import BaseResourceCollection from "./BaseResourceCollection";
import { combineUrls } from "../../utils/url";
import { ContextTypes } from "../apiClients/models/context";

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

    queryContexts(query: string, ...types: ContextTypes[]) {
        const baseUrl = this.contexts();

        const oDataQuery = buildQuery({
            filter: {
                "type.id": { in: types },
            },
            search: query,
        });

        return `${baseUrl}${oDataQuery}`;
    }

    relatedContexts(id: string, ...types: ContextTypes[]) {
        const oDataQuery = buildQuery({
            filter: {
                "type.id": { in: types },
            },
        });

        return combineUrls(this.context(id), `relations${oDataQuery}`);
    }
}
