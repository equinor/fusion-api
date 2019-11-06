import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class ReportResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getOrgBaseUrl());
    }

    getReports(): string {
        return combineUrls(this.getBaseUrl(), 'reports');
    }

    getReport(id: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', id);
    }

    getEmbedInfo(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'config', 'embedinfo');
    }

    getAccessToken(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'token');
    }

    getDescription(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'description', 'content');
    }

    getTechnicalDocument(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'technicaldocument', 'content');
    }

    getAccessDescription(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'accessdescription', 'content');
    }

    addReport(): string {
        return combineUrls(this.getBaseUrl(), 'reports');
    }

    updateReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId);
    }

    updateConfig(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'config');
    }

    validateConfig(): string {
        return combineUrls(this.getBaseUrl(), 'reports', 'config', 'validate');
    }

    publishReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'publish');
    }

    unPublishReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'unpublish');
    }

    deleteReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId);
    }
}
