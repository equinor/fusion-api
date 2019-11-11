import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class ReportResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getReportsBaseUrl());
    }

    reports(): string {
        return combineUrls(this.getBaseUrl(), 'reports');
    }

    report(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId);
    }

    embedInfo(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'config', 'embedinfo');
    }

    accessToken(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'token');
    }

    description(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'description', 'content');
    }

    technicalDocument(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'technicaldocument', 'content');
    }

    accessDescription(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'accessdescription', 'content');
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
}
