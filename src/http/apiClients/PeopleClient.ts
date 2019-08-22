import BaseApiClient from './BaseApiClient';
import ResourceCollections from '../resourceCollections';
import { IHttpClient } from '../HttpClient';
import PersonDetails from './models/people/PersonDetails';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';

export default class PeopleClient extends BaseApiClient {
    constructor(httpClient: IHttpClient, resourceCollection: ResourceCollections) {
        super(httpClient, resourceCollection);

        httpClient.getAsync(resourceCollection.people.apiSignin(), {
            headers: { credentials: 'include' },
        });
    }

    async getPersonDetailsAsync(id: string) {
        const url = this.resourceCollections.people.getPersonDetails(id);
        return await this.httpClient.getAsync<PersonDetails, FusionApiHttpErrorResponse>(url);
    }

    async getPersonPhotoAsync(id: string) {
        const url = this.resourceCollections.people.getPersonPhoto(id);
        return await this.httpClient.getAsync(url);
    }
}
