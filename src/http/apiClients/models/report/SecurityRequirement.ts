type SecurityRequirementType = 'discipline' | 'contract';

type SecurityRequirement = {
    id: string;
    type: SecurityRequirementType;
    value: string;
};

export default SecurityRequirement;
