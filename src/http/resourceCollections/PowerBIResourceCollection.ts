import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class PowerBIResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getPowerBiApiBaseUrl();
    }

    groups(): string {
        return combineUrls(this.getBaseUrl(), 'groups');
    }

    reports(groupId: string) {
        return combineUrls(this.getBaseUrl(), 'groups', groupId, 'reports');
    }

    dashboards(groupId: string) {
        return combineUrls(this.getBaseUrl(), 'groups', groupId, 'dashboards');
    }
}
