import { createContext, useContext } from "react";
import { History } from "history";
import { useFusionContext } from "../core/FusionContext";

export interface IHistoryContext {
    history: History | null;
}
export const HistoryContext = createContext<IHistoryContext>({ history: null });

export default (): History => {
    const fusionContext = useFusionContext();
    const historyContext = useContext(HistoryContext);

    return historyContext.history || fusionContext.history;
};
