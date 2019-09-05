import { createContext, useContext, useEffect, useState } from "react";
import { History } from "history";
import { useFusionContext } from "../core/FusionContext";

export interface IHistoryContext {
    history: History | null;
}
export const HistoryContext = createContext<IHistoryContext>({ history: null });

export default (): History => {
    const fusionContext = useFusionContext();
    const historyContext = useContext(HistoryContext);

    const history = historyContext.history || fusionContext.history;

    const [_, forceUpdate] = useState(null);
    useEffect(() => {
        const listner = history.listen(() => forceUpdate(null));
        return listner;
    }, [history]);

    return historyContext.history || fusionContext.history;
};
