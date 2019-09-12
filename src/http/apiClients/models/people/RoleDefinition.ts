type RoleDefinition = {
    name: string;
    displayName: string;
    type: string;
    scopeType: string | null;
    description: string | null;
    onDemandSupport: boolean;
    sourceSystem: string;
};

export default RoleDefinition;
