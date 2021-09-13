import { combineUrls } from '../../utils/url';
import BaseResourceCollection from './BaseResourceCollection';

export default class DataExportResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return 'https://pro-s-portal-pr-2713.azurewebsites.net';
    }

    exportData(): string {
        return combineUrls(this.getBaseUrl(), 'api', 'data-exports');
    }
}
