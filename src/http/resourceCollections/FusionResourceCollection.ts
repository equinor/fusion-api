import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import ServiceResolver from './ServiceResolver';
import { FusionContextOptions } from '../../core/FusionContext';

export default class FusionResourceCollection extends BaseResourceCollection {
    options?: FusionContextOptions;

    constructor(serviceResolver: ServiceResolver, options?: FusionContextOptions) {
        super(serviceResolver);
        this.options = options;
    }

    protected getBaseUrl() {
        return this.serviceResolver.getFusionBaseUrl();
    }

    apps(): string {
        return combineUrls(this.getBaseUrl(), 'bundles', 'apps');
    }

    app(appKey: string) {
        return combineUrls(this.getBaseUrl(), this.getBundlesPath(), 'apps', appKey);
    }

    appManifest(appKey: string) {
        return combineUrls(this.app(appKey), this.getAppManifestFileName());
    }

    token(resource: string) {
        return combineUrls(this.getBaseUrl(), 'api', 'auth', 'token?resource=') + resource;
    }

    appScript(appKey: string) {
        if (this.options && this.options.loadBundlesFromDisk) {
            return combineUrls(this.app(appKey), `app-bundle.js?v=${+new Date()}`);
        }

        return this.app(appKey) + '.js';
    }

    appIcon(appKey: string) {
        return combineUrls(this.app(appKey), this.getResourcesPath(), 'app-icon.svg');
    }

    featureLog() {
        return combineUrls(this.getBaseUrl(), 'log', 'features');
    }

    signalRHub(hubName: string){
        return combineUrls(this.getBaseUrl(), 'api', hubName, 'negotiate')
    }

    private getBundlesPath() {
        return this.options && this.options.loadBundlesFromDisk ? 'js' : 'bundles';
    }

    private getAppManifestFileName() {
        return this.options && this.options.loadBundlesFromDisk
            ? `app-manifest.json?v=${+new Date()}`
            : '';
    }

    private getResourcesPath() {
        return this.options && this.options.loadBundlesFromDisk ? '' : 'resources';
    }
}
