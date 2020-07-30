import BaseApiClient from './BaseApiClient';
import ResourceCollections from '../resourceCollections';
import { IHttpClient } from '../HttpClient';
import PersonDetails, {
    PersonAccountType,
    PersonRole,
    PersonBasePosition,
    PersonContract,
    PersonPosition,
    PersonProject,
    PersonRoleScope,
    PersonPresence,
} from './models/people/PersonDetails';
import RoleDefinition from './models/people/RoleDefinition';
import { FusionApiHttpErrorResponse } from './models/common/FusionApiHttpErrorResponse';
import { PersonODataExpand } from '../resourceCollections/PeopleResourceCollection';
import GroupRoleMapping from './models/people/GroupRoleMapping';
import RoleStatus from './models/people/RoleStatus';
import ServiceResolver from '../resourceCollections/ServiceResolver';
import fusionConsole from '../../utils/fusionConsole';

export {
    PersonDetails,
    PersonAccountType,
    PersonRole,
    PersonBasePosition,
    PersonContract,
    PersonPosition,
    PersonProject,
    PersonRoleScope,
    PersonODataExpand,
};

export default class PeopleClient extends BaseApiClient {
    constructor(
        protected httpClient: IHttpClient,
        protected resourceCollection: ResourceCollections,
        serviceResolver: ServiceResolver
    ) {
        super(httpClient, resourceCollection, serviceResolver);
        this.apiSigninAsync();
    }

    private apiSigninAsync() {
        try {
            this.httpClient.postAsync<any, unknown, unknown>(
                this.resourceCollection.people.apiSignin(),
                { credentials: 'include' },
                null,
                async () => Promise.resolve()
            );
        } catch (e) {
            fusionConsole.error(e);
        }
    }

    protected getBaseUrl() {
        return this.serviceResolver.getPeopleBaseUrl();
    }

    async getPersonDetailsAsync(id: string, oDataExpand?: PersonODataExpand[]) {
        const url = this.resourceCollections.people.getPersonDetails(id, oDataExpand);
        return await this.httpClient.getAsync<PersonDetails, FusionApiHttpErrorResponse>(url, {
            headers: { 'api-version': '3.0' },
        });
    }

    async getRoleDefinitionsAsync() {
        const url = this.resourceCollections.people.roleDefinitions();
        return await this.httpClient.getAsync<RoleDefinition[], FusionApiHttpErrorResponse>(url);
    }

    async getGroupRoleMappingsAsync() {
        const url = this.resourceCollections.people.groupRoleMappings();
        return await this.httpClient.getAsync<GroupRoleMapping[], FusionApiHttpErrorResponse>(url);
    }

    async searchPersons(query: string) {
        const url = this.resourceCollections.people.searchPersons(query);
        return await this.httpClient.getAsync<PersonDetails[], FusionApiHttpErrorResponse>(url, {
            headers: { 'api-version': '2.0' },
        });
    }

    async setRoleStatusForCurrentUser(roleName: string, active: boolean) {
        const url = this.resourceCollections.people.roleStatusCurrentUser(roleName);
        return await this.httpClient.patchAsync<RoleStatus, PersonRole, FusionApiHttpErrorResponse>(
            url,
            {
                isActive: active,
            }
        );
    }

    async setRoleStatusForUser(userId: string, roleName: string, active: boolean) {
        const url = this.resourceCollections.people.roleStatus(userId, roleName);
        return await this.httpClient.patchAsync<RoleStatus, PersonRole, FusionApiHttpErrorResponse>(
            url,
            {
                isActive: active,
            }
        );
    }

    async getPresenceAsync(userId: string, apiVersion?: string) {
        const url = this.resourceCollections.people.personPresence(userId);
        const version = apiVersion ? `?api-version=${apiVersion}` : '';
        return await this.httpClient.getAsync<PersonPresence, FusionApiHttpErrorResponse>(
            `${url}${version}`
        );
    }
}
