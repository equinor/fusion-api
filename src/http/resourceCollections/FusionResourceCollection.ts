import BaseResourceCollection from "./BaseResourceCollection";
import combineUrls from "../../utils/combineUrls";

export default class FusionResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataProxyBaseUrl();
    }

    apps(): string {
        return combineUrls(this.getBaseUrl(), "bundles", "apps");
    }

    appManifest(appKey: string): string {
        return combineUrls(this.apps(), appKey);
    }

    appScript(appKey: string): string {
        return this.appManifest(appKey) + ".js";
    }
}