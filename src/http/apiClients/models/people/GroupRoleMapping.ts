import RoleDefinition from './RoleDefinition';

type GroupRoleMapping = {
    id: string;
    groupUniqueId: string;
    role: RoleDefinition;
};

export default GroupRoleMapping;
