import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import { ContextTypes } from '../apiClients/models/context';

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

    securityPermission(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'securitypermission', 'content');
    }

    validateConfig(): string {
        return combineUrls(this.getBaseUrl(), 'reports', 'config', 'validate');
    }

    updateConfig(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'config');
    }

    embedInfo(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'config', 'embedinfo');
    }

    publishReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'publish');
    }

    unPublishReport(reportId: string): string {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'unpublish');
    }

    rlsRequirements(reportId: string) {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'rlsrequirements');
    }

    auditLog(reportId: string) {
        return combineUrls(this.getBaseUrl(), 'reports', reportId, 'auditlog');
    }

    checkAccess(reportId: string, contextExternalId: string, contextType: ContextTypes) {
        return combineUrls(
            this.getBaseUrl(),
            'reports',
            reportId,
            'contexts',
            contextExternalId,
            'contexttypes',
            contextType,
            'checkaccess'
        );
    }
}
