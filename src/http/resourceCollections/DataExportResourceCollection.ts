import { combineUrls } from '../../utils/url';
import BaseResourceCollection from './BaseResourceCollection';

export default class DataExportResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataExportBaseUrl();
    }

    export(): string {
        return combineUrls(this.getBaseUrl(), 'api', 'data-exports');
    }

    download(id: string): string {
        return combineUrls(this.getBaseUrl(), 'api', 'data-exports', id);
    }
}
