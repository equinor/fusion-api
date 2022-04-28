import Position from './Position';

export type Organisation = {
    id: string | null;
    name: string | null;
    type: null;
    parentId: string | null;
    managerPosition: Position | null;
    managerPositionId: string | null;
};

export type OrganisationsRespose = {
    isFromPims: boolean;
    organisations: Organisation[];
};
