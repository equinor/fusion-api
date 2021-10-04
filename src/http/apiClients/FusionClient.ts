import BaseApiClient from './BaseApiClient';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import AppManifest from './models/fusion/apps/AppManifest';
import { FeatureLogBatch } from './models/fusion/FeatureLogEntryRequest';
import getScript from '../../utils/getScript';
import { SignalRNegotiation } from './models/fusion/SignalRNegotiation';
import { DataExportRequest } from './models/fusion/dataExport/DataExportRequest';
import { DataExportResponse } from './models/fusion/dataExport/DataExportResponse';

export default class FusionClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getFusionBaseUrl();
    }

    async getAppsAsync() {
        const url = this.resourceCollections.fusion.apps();
        return await this.httpClient.getAsync<AppManifest[], FusionApiHttpErrorResponse>(url);
    }

    async getAppManifestAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appManifest(appKey);
        return await this.httpClient.getAsync<AppManifest, FusionApiHttpErrorResponse>(url);
    }

    async loadAppScriptAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appScript(appKey);
        return await getScript(url);
    }

    async logFeaturesAsync(batch: FeatureLogBatch) {
        const url = this.resourceCollections.fusion.featureLog();
        return await this.httpClient.postAsync<FeatureLogBatch, void, FusionApiHttpErrorResponse>(
            url,
            batch,
            null,
            () => Promise.resolve()
        );
    }

    async getAppIconAsync(appKey: string) {
        const url = this.resourceCollections.fusion.appIcon(appKey);
        return await this.httpClient.getAsync<string, Error>(
            url,
            { credentials: 'include' },
            async (response: Response) => {
                return await response.text();
            }
        );
    }

    async negotiateSignalRHub(hubName: string) {
        const url = this.resourceCollections.fusion.signalRHub(hubName);
        return await this.httpClient.postAsync<
            void,
            SignalRNegotiation,
            FusionApiHttpErrorResponse
        >(url, undefined);
    }
    /**
     * Method for sending post request to the data export service.
     * Used for generating an excel file with the data passed as an argument.
     * @param excelData The data which is to be put into the generated excel file.
     * @returns A promise with a temporary id, status of the generating file, and expire date.
     */
    public createExcelFile(excelData: DataExportRequest) {
        const url = this.resourceCollections.fusion.exportExcel();
        return this.httpClient.postAsync<
            DataExportRequest,
            DataExportResponse,
            FusionApiHttpErrorResponse
        >(url, excelData);
    }
    /**
     * Method for sending get request to the data export service.
     * Used for retrieving the status of the generating excel file.
     * When the status is 'Complete', it is ready to be downloaded.
     * @param id The temporary id of the generated excel file returned by the data export service.
     * @returns A promise with the status of the generating file.
     */
    public getExcelStatus(id: string) {
        const url = this.resourceCollections.fusion.downloadExcel(id);
        return this.httpClient.getAsync<DataExportResponse, FusionApiHttpErrorResponse>(url);
    }

    /**
     * Method for sending requests to the export data service until the export state is completed.
     * Will timeout after 10 retries and go on for 500 ms
     * @param excelData Data which is to be put in the exported file
     * @returns A promise with either a valid url and filename or an error after timeout.
     */
    public getExcelStatusInterval(
        excelData: DataExportRequest
    ): Promise<{ url: string; fileName: string }> {
        //@eslint-disable no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    data: { tempKey },
                } = await this.createExcelFile(excelData);
                let retryCount = 0;
                const interval = (setInterval(async () => {
                    const {
                        data: { exportState },
                    } = await this.getExcelStatus(tempKey);
                    retryCount++;
                    if (retryCount > 10) {
                        clearInterval(interval);
                        const err = new Error('Timeout error');
                        reject(err);
                        throw err;
                    }
                    if (exportState === 'Complete') {
                        clearInterval(interval);
                        resolve({
                            url: `${this.resourceCollections.fusion.downloadExcel(tempKey)}.xlsx`,
                            fileName: excelData.fileName,
                        });
                    }
                }, 500) as unknown) as number;
            } catch (err) {
                reject(err);
                console.error(err);
            }
        });
    }
}
