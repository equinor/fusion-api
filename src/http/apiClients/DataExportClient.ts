import { FusionApiHttpErrorResponse } from '.';
import BaseApiClient from './BaseApiClient';
import { DataExportRequest } from './models/dataExport/DataExportRequest';
import { DataExportResponse } from './models/dataExport/DataExportResponse';

export class DataExportClient extends BaseApiClient {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataExportBaseUrl();
    }

    protected createUrl(href: string, params?: Record<string, string>): string {
        params = { ['api-version']: '1.0', ...params };
        const url = new URL(href);
        Object.keys(params).forEach((p) => url.searchParams.append(p, params![p]));
        return url.toString();
    }

    public createExcelFile(excelData: DataExportRequest) {
        const baseUrl = this.resourceCollections.dataExport.export();
        const url = this.createUrl(baseUrl);
        return this.httpClient.postAsync<
            DataExportRequest,
            DataExportResponse,
            FusionApiHttpErrorResponse
        >(url, excelData);
    }
}
