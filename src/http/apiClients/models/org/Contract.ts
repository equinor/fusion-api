import Position from './Position';

type Contract = {
    id: string;
    name: string;
    description: string;
    contractNumber: string;
    isDeleted: boolean;
    company: ContractCompany;
    companyRep?: Position;
    contractRep?: Position;
    externalCompanyRep?: Position;
    externalContractRep?: Position;
};

type ContractCompany = {
    id: string;
    name: string;
};

export default Contract;
