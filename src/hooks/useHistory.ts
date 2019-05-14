import { History } from "history";
import { useFusionContext } from "../core/FusionContext";

export default (): History => {
    const fusionContext = useFusionContext();
    return fusionContext.history;
};
