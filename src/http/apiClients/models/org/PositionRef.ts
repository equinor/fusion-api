import BasePosition from "./BasePosition";

type PositionRef = {
    id: string;
    externalId: string;
    name: string;
    parentPositionId: string | null;
    basePosition: BasePosition;
}
export default PositionRef;