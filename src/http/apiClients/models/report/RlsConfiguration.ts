export type RlsMappingType =
    | 'Unknown'
    | 'AdGroup'
    | 'ProjectMembership'
    | 'AdvancedProjectMembership'
    | 'ContractMembership'
    | 'Positions';

export type RlsNotFoundMode = 'UserEmail' | 'Null';

export type RlsDelimiter = ';' | '|';

//Unkown is a "deliberate" spelling error. It is spelled like this in the rls-configuration schema.
export type RlsMatch = 'Unkown' | 'All' | 'Any';

export type RlsUserTypes = 'Unknown' | 'PermanentEmployee' | 'ExtHire' | 'Consultant' | 'External';

export type RlsMemberShipRequirementType =
    | 'Unknown'
    | 'Department'
    | 'AdGroup'
    | 'DomainMembership'
    | 'Account';

export type AccessITRole = {
    id: string;
    name: string | null;
    url: string | null;
};

export type RlsAdGroupMapping = {
    groupId: string;
    groupName: string | null;
    identityName: string | null;
};

export type WorkspaceRole = {
    requireMembership: boolean;
    level: string | null;
};

export type RlsGlobalAccessRequirement = {
    accessIT: AccessITRole | null;
    workspace: WorkspaceRole | null;
};

export type RlsIdentityConfiguration = {
    mappingType: RlsMappingType;
    notFoundMode: RlsNotFoundMode;
    delimiter: RlsDelimiter | null;
    nameSelector: string | null;
    adGroupMapping?: RlsAdGroupMapping[] | null;
    projectMembershipConfig?: RlsIdentityProjectMembershipConfig;
};

export type RlsIdentityProjectMembershipConfig = {
    match: RlsMatch;
    conditions: RlsCondition[] | null;
};

export type RlsCondition = {
    displayName: string;
    role?: string | null;
    obs?: string | null;
    pmt?: boolean | null;
    basePositions?: BasePositionCondition[] | null;
    disciplines?: string[] | null;
    userTypes?: RlsUserTypes[] | null;
};

export type BasePositionCondition = {
    id: string;
    name: string | null;
};

export type RlsRoleConfiguration = {
    name: string | null;
    description: string | null;
    pbiName: string | null;
    isAdminRole: boolean;
    membership: RlsRoleMembershipRequirement[] | null;
};

export type RlsRoleMembershipRequirement = {
    type: RlsMemberShipRequirementType;
    identifiers: string[] | null;
    userTypes: RlsUserTypes[] | null;
    allowExternals: boolean;
    adGroups?: RlsAdGroup[] | null;
    domainConfig?: RlsRoleDomainMembershipConfig;
};

export type RlsAdGroup = {
    id: string;
    name: string | null;
};

export type RlsRoleDomainMembershipConfig = {
    requiredPositionObs: string[] | null;
};

type RlsConfiguration = {
    version: number;
    globalAccessRequirement: RlsGlobalAccessRequirement | null;
    identity: RlsIdentityConfiguration | null;
    roles: RlsRoleConfiguration[] | null;
};

export default RlsConfiguration;
