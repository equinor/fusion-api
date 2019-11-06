import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class PowerBIResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return 'https://api.powerbi.com/v1.0/myorg';
    }

    getGroups(): string {
        return combineUrls(this.getBaseUrl(), 'groups');
    }

    getReports(groupId: string) {
        return combineUrls(this.getBaseUrl(), 'groups', groupId, 'reports');
    }

    getDashboards(groupId: string) {
        return combineUrls(this.getBaseUrl(), 'groups', groupId, 'dashboards');
    }
}
