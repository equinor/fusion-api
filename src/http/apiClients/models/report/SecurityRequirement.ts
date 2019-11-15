type SecurityRequirementType = 'discipline' | 'contract';

type SecurityRequirement = {
    type: SecurityRequirementType;
    value: string;
};

export default SecurityRequirement;
