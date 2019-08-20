type BasePosition = {
    id: string;
    name: string;
    department: string;
    discipline: string;
    roleDescription?: string; // likely not supplied by initial API call, must do second call to separate endpoint look it up
};

export default BasePosition;
