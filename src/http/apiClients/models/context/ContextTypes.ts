export enum ContextTypes {
    Contract = 'Contract',
    OrgChart = 'OrgChart',
    PDP = 'PDP',
    PimsDomain = 'PimsDomain',
    Portfolio = 'Portfolio',
    Project = 'Project',
    ProjectMaster = 'ProjectMaster',
    Facility = 'Facility',
}

export class ContextType {
    readonly id: ContextTypes;
    readonly isChildType: boolean;
    readonly parentTypeIds: string[];

    constructor(id: ContextTypes, isChildType: boolean, parentTypeIds: string[] = []) {
        this.id = id;
        this.isChildType = isChildType;
        this.parentTypeIds = parentTypeIds;
    }
}
