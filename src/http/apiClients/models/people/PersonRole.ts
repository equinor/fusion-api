import PersonRoleScope from './PersonRoleScope';

type PersonRole = {
    name: string;
    displayName: string;
    sourceSystem: string;
    type: string;
    isActive: boolean;
    activeToUtc?: string;
    onDemandSupport: boolean;
    scope: PersonRoleScope;
};

export default PersonRole;
