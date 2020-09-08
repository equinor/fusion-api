import ServiceResolver from './ServiceResolver';
import { combineUrls } from '../../utils/url';

export default abstract class BaseResourceCollection {
    protected serviceResolver: ServiceResolver;

    constructor(serviceResolver: ServiceResolver) {
        this.serviceResolver = serviceResolver;
    }

    protected abstract getBaseUrl(): string;

    protected getSiteAndProjectUrl(
        siteCode: string,
        projectIdentifier: string,
        action: string
    ): string {
        return combineUrls(
            this.getBaseUrl(),
            '/api/sites',
            siteCode,
            'projects',
            projectIdentifier,
            action
        );
    }
}
