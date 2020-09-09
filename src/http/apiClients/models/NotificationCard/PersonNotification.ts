import { PersonAccountType } from '../../PeopleClient';

export type PersonNotification = {
    id: string;
    name: string;
    jobTitle: string;
    mail: string;
    accountType: PersonAccountType;
};
