import BaseApiClient from './BaseApiClient';
import IHttpClient from '../HttpClient';
import ResourceCollections from '../resourceCollections';

export default class PeopleApiClient extends BaseApiClient {
    constructor(httpClient: IHttpClient, resourceCollection: ResourceCollections) {
        super(httpClient, resourceCollection);

        httpClient.getAsync(resourceCollection.people.apiSignin());
    }
}
