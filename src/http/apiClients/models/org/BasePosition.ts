import { RoleDescriptionContent } from './RoleDescription';

export type BasePositionSettings = {
    directAssignmentEnabled: boolean | null;
    isDefaultTaskOwner: boolean;
};

type BasePosition = {
    id: string;
    name: string;
    department: string;
    discipline: string;
    projectType: string;
    subDiscipline: string | null;
    settings?: BasePositionSettings;
    roleDescription?: RoleDescriptionContent;
    inactive: boolean;
};

export default BasePosition;
