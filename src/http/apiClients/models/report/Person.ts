import { PersonDetails } from '../../PeopleClient';

type Person = PersonDetails & {
    id: string;
    isAffiliateAccess: boolean;
};

export default Person;
