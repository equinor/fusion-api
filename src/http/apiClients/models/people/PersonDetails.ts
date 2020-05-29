import PersonRole from './PersonRole';
import PersonContract from './PersonContract';
import PersonPosition from './PersonPosition';
import PersonProject from './PersonProject';
import PersonBasePosition from './PersonBasePosition';
import PersonRoleScope from './PersonRoleScope';
import PersonAccountType from './PersonAccountType';
import PersonCompany from './PersonCompany';
import PersonPresence from './PersonPresence';

export {
    PersonRole,
    PersonContract,
    PersonPosition,
    PersonProject,
    PersonBasePosition,
    PersonRoleScope,
    PersonAccountType,
    PersonCompany,
    PersonPresence,
};

type PersonDetails = {
    azureUniqueId: string;
    name: string;
    mail: string | null;
    jobTitle: string | null;
    department: string | null;
    mobilePhone: string | null;
    officeLocation: string | null;
    upn: string;
    accountType: PersonAccountType;
    company: PersonCompany;
    roles?: PersonRole[];
    contracts?: PersonContract[];
    positions?: PersonPosition[];
};

export default PersonDetails;
