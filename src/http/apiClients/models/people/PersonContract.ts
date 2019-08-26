import PersonProject from './PersonProject';

type PersonContract = {
    id: string;
    name: string;
    companyId?: string;
    companyName: string;
    number: string;
    project: PersonProject;
};

export default PersonContract;
