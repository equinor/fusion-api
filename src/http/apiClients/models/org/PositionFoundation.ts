import BasePosition from "./BasePosition";

type PositionFoundation = {
    id: string;
    externalId: string;
    name: string;
    parentPositionId: string | null;
    basePosition: BasePosition;
}
export default PositionFoundation;