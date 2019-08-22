import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';

export default class PeopleResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getPeopleBaseUrl();
    }

    apiSignin(): string {
        return combineUrls(this.getBaseUrl(), 'api-signin');
    }

    getPersonDetails(id: string) {
        return '';
    }

    getPersonPhoto(id: string) {
        // id or url?
        return '';
    }
}
