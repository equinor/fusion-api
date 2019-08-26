import PersonRole from './PersonRole';
import PersonContract from './PersonContract';
import PersonPosition from './PersonPosition';
import PersonProject from './PersonProject';
import PersonBasePosition from './PersonBasePosition';
import PersonRoleScope from './PersonRoleScope';
import PersonAccountType from './PersonAccountType';
import PersonCompany from './PersonCompany';

export {
    PersonRole,
    PersonContract,
    PersonPosition,
    PersonProject,
    PersonBasePosition,
    PersonRoleScope,
    PersonAccountType,
    PersonCompany,
};

type PersonDetails = {
    azureUniqueId: string;
    name: string;
    mail: string;
    jobTitle: string;
    department: string;
    mobilePhone: string;
    officeLocation: string;
    upn: string;
    accountType: PersonAccountType;
    company: PersonCompany;
    roles?: PersonRole[];
    contracts?: PersonContract[];
    positions?: PersonPosition[];
};

export default PersonDetails;
