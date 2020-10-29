import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import Report from './models/report/Report';
import EmbedInfo from './models/report/EmbedInfo';
import EmbedConfig from './models/report/EmbedConfig';
import AccessToken from './models/report/AccessToken';
import ConfigValidation from './models/report/ConfigValidation';
import BaseApiClient from './BaseApiClient';
import UpdateMarkdown from './models/report/UpdateMarkdown';
import { ContextTypes } from './models/context';

export default class ReportClient extends BaseApiClient {
    protected getBaseUrl() {
        return this.serviceResolver.getReportsBaseUrl();
    }

    async getReportsAsync() {
        const url = this.resourceCollections.report.reports();
        return await this.httpClient.getAsync<Report[], FusionApiHttpErrorResponse>(url);
    }

    async getReportAsync(id: string) {
        const url = this.resourceCollections.report.report(id);
        return await this.httpClient.getAsync<Report, FusionApiHttpErrorResponse>(url);
    }

    async getEmbedInfo(reportId: string) {
        const url = this.resourceCollections.report.embedInfo(reportId);
        return await this.httpClient.getAsync<EmbedInfo, FusionApiHttpErrorResponse>(url);
    }

    async getAccessToken(reportId: string) {
        const url = this.resourceCollections.report.accessToken(reportId);
        return await this.httpClient.getAsync<AccessToken, FusionApiHttpErrorResponse>(url);
    }

    async getDescription(reportId: string) {
        const url = this.resourceCollections.report.description(reportId);
        return await this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            (response) => response.text()
        );
    }

    async updateDescription(reportId: string, description: string | null) {
        const url = this.resourceCollections.report.description(reportId);
        return await this.httpClient.putAsync<UpdateMarkdown, string, FusionApiHttpErrorResponse>(
            url,
            { content: description },
            null,
            (response) => response.text()
        );
    }

    async getAccessDescription(reportId: string) {
        const url = this.resourceCollections.report.accessDescription(reportId);
        return await this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            (response) => response.text()
        );
    }

    async updateAccessDescription(reportId: string, description: string | null) {
        const url = this.resourceCollections.report.accessDescription(reportId);
        return await this.httpClient.putAsync<UpdateMarkdown, string, FusionApiHttpErrorResponse>(
            url,
            { content: description },
            null,
            (response) => response.text()
        );
    }

    async getTechnicalDocument(reportId: string) {
        const url = this.resourceCollections.report.technicalDocument(reportId);
        return await this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            (response) => response.text()
        );
    }

    async getRlsRequirements(reportId: string) {
        const url = this.resourceCollections.report.rlsRequirements(reportId);
        return await this.httpClient.getAsync<string, FusionApiHttpErrorResponse>(
            url,
            null,
            (response) => response.text()
        );
    }

    async addReport(report: Report) {
        const url = this.resourceCollections.report.reports();
        return await this.httpClient.postAsync<Report, Report, FusionApiHttpErrorResponse>(
            url,
            report
        );
    }

    async updateReport(report: Report) {
        const url = this.resourceCollections.report.report(report.id);
        return await this.httpClient.putAsync<Report, Report, FusionApiHttpErrorResponse>(
            url,
            report
        );
    }

    async updateConfig(reportId: string, embedConfig: EmbedConfig) {
        const url = this.resourceCollections.report.updateConfig(reportId);
        return await this.httpClient.putAsync<EmbedConfig, ConfigValidation, ConfigValidation>(
            url,
            embedConfig
        );
    }

    async validateConfig(embedConfig: EmbedConfig) {
        const url = this.resourceCollections.report.validateConfig();
        return await this.httpClient.postAsync<EmbedConfig, ConfigValidation, ConfigValidation>(
            url,
            embedConfig
        );
    }

    async publishReport(reportId: string) {
        const url = this.resourceCollections.report.publishReport(reportId);
        return await this.httpClient.putAsync<string, string, FusionApiHttpErrorResponse>(url, '');
    }

    async unPublishReport(reportId: string) {
        const url = this.resourceCollections.report.unPublishReport(reportId);
        return await this.httpClient.putAsync<string, string, FusionApiHttpErrorResponse>(url, '');
    }

    async deleteReport(reportId: string) {
        const url = this.resourceCollections.report.report(reportId);

        return await this.httpClient.deleteAsync<void, FusionApiHttpErrorResponse>(url, null, () =>
            Promise.resolve()
        );
    }

    async checkContextAccess(
        reportId: string,
        contextExternalId: string,
        contextType: ContextTypes
    ) {
        const url = this.resourceCollections.report.checkAccess(
            reportId,
            contextExternalId,
            contextType
        );

        return await this.httpClient.optionsAsync<void, FusionApiHttpErrorResponse>(url);
    }
}
