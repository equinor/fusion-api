import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export class InfoResourceCollection extends BaseResourceCollection {
    protected getBaseUrl() {
        return combineUrls(this.serviceResolver.getNotificationBaseUrl());
    }

    public quickFact(scope: string, id: string) {
        return combineUrls(this.getBaseUrl(), `collections/${scope}/quickfacts/${id}`);
    }

    public quickFacts(scope: string) {
        return combineUrls(this.getBaseUrl(), `collections/${scope}/quickfacts`);
    }
}

export default InfoResourceCollection;
