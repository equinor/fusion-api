import PersonRole from './PersonRole';
import PersonContract from './PersonContract';
import PersonPosition from './PersonPosition';
import PersonProject from './PersonProject';
import PersonBasePosition from './PersonBasePosition';
import PersonRoleScope from './PersonRoleScope';
import PersonAccountType from './PersonAccountType';

export {
    PersonRole,
    PersonContract,
    PersonPosition,
    PersonProject,
    PersonBasePosition,
    PersonRoleScope,
    PersonAccountType,
};

type PersonDetails = {
    azureUniqueId: string;
    mail: string;
    jobTitle: string;
    department: string;
    mobilePhone: string;
    officeLocation: string;
    upn: string;
    accountType: PersonAccountType;
    company: string;
    roles?: PersonRole[];
    contracts?: PersonContract[];
    positions?: PersonPosition[];
};

export default PersonDetails;
