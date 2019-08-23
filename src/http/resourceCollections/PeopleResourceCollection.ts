import BaseResourceCollection from './BaseResourceCollection';
import { combineUrls } from '../../utils/url';
import buildQuery from 'odata-query';

export default class PeopleResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getPeopleBaseUrl();
    }

    apiSignin(): string {
        return combineUrls(this.getBaseUrl(), 'api-signin');
    }

    getPersonDetails(id: string, oDataExpand?: PersonODataExpand[]): string {
        const expand = oDataExpand ? oDataExpand.map(s => s) : [];
        const oDataQuery = buildQuery({ expand });
        const url = combineUrls(this.getBaseUrl(), 'persons', id);

        return `${url}${oDataQuery}`;
    }

    getPersonPhoto(id: string): string {
        return combineUrls(this.getBaseUrl(), 'persons', id, 'photo');
    }
}

export enum PersonODataExpand {
    positions = 'positions',
    roles = 'roles',
    contracts = 'contracts',
}
