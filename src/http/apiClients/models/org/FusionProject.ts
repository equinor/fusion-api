type FusionProjectMapping = {
    id:string,
    key:string;
    projectId:string;
    type:string;
    value:string;
}
type FusionProject = {
    id:string;
    isDeleted: boolean;
    name: string; 
    mappings: FusionProjectMapping[]; 
}

export default FusionProject;