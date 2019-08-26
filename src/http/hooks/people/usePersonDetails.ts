import useApiClient, { ApiClientHookResult } from '../useApiClient';
import { PersonDetails, PersonODataExpand } from '../../apiClients/PeopleClient';

export { PersonODataExpand };

export const usePersonDetails = (
    personId: string,
    expand?: PersonODataExpand[]
): ApiClientHookResult<PersonDetails> => {
    return useApiClient<PersonDetails>(
        async apiClients => {
            const response = await apiClients.people.getPersonDetailsAsync(personId, expand);
            return response.data;
        },
        [personId, expand]
    );
};
