type BasePositionCondition = {
    id: string;
    name: string | null;
};

type UserTypes = 'Unknown' | 'PermanentEmployee' | 'ExtHire' | 'Consultant' | 'External';

type ConditionsMatch = 'Unknown' | 'All' | 'Any';

type RoleMemberShipType = 'Unknown' | 'Department' | 'AdGroup' | 'DomainMembership' | 'Account';

type AccessITRole = {
    id: string;
    name: string | null;
    url: string | null;
};

type WorkspaceRole = {
    requireMembership: boolean;
    level: string | null;
};

type Conditions = {
    role: string | null;
    obs: string | null;
    pmt: boolean | null;
    basePositions: BasePositionCondition[] | null;
    disciplines: string[] | null;
    userTypes: UserTypes[] | null;
};

type ProjectMembershipConfig = {
    match: ConditionsMatch;
    conditions: Conditions[];
};

type RlsAdGroupMapping = {
    groupId: string;
    groupName: string | null;
    identityName: string | null;
};

type RlsIdentityConfiguration = {
    mappingType: string;
    notFoundMode: string | null;
    delimiter: string | null;
    nameSelector: string | null;
    adGroupMapping?: RlsAdGroupMapping | null;
    projectMembershipConfig?: ProjectMembershipConfig | null;
};

type RlsGlobalAccessRequirement = {
    accessIT: AccessITRole | null;
    workspace: WorkspaceRole | null;
};

type RlsAdGroup = {
    id: string;
    name: string | null;
};

type RlsRoleDomainMembershipConfig = {
    requiredPositionObs: string[] | null;
};

type RlsRoleMembershipRequirement = {
    type: RoleMemberShipType;
    identifiers: string[] | null;
    userTypes: UserTypes[] | null;
    allowExternals: boolean;
    adGroups?: RlsAdGroup[] | null;
    domaingConfig?: RlsRoleDomainMembershipConfig | null;
};

type RlsRoles = {
    name: string | null;
    descriptions: string | null;
    pbiName: string | null;
    isAdminRole: boolean;
    membership: RlsRoleMembershipRequirement[];
};

type RlsConfiguration = {
    version: number;
    globalAccessRequirement: RlsGlobalAccessRequirement;
    identity: RlsIdentityConfiguration;
    roles: RlsRoles[];
};

export default RlsConfiguration;
