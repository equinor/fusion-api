import PersonProject from './PersonProject';
import PersonBasePosition from './PersonBasePosition';

type PersonPosition = {
    id: string;
    name: string;
    parentPositionId?: string;
    obs: string;
    project: PersonProject;
    basePosition: PersonBasePosition;
    appliesFrom: Date | null;
    appliesTo: Date | null;
    workload: number | null;
};

export default PersonPosition;
