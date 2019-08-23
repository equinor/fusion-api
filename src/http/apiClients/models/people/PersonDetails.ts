import PersonRole from './PersonRole';
import PersonContract from './PersonContract';
import PersonPosition from './PersonPosition';

type PersonDetails = {
    azureUniqueId: string;
    mail: string;
    jobTitle: string;
    department: string;
    mobilePhone: string;
    officeLocation: string;
    upn: string;
    accountType: string;
    company: string;
    roles?: PersonRole[];
    contracts?: PersonContract[];
    positions?: PersonPosition[];
};

export default PersonDetails;
