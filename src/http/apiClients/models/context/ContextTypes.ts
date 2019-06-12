export enum ContextTypes {
    Project = "Project",
    PDP = "PDP",
};

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

