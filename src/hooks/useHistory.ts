import { createContext, useContext, useEffect, useState } from "react";
import { History } from "history";
import { useFusionContext } from "../core/FusionContext";

export interface IHistoryContext {
    history: History | null;
}

const ensureGlobalFusionHistoryContextType = () => {
    const win = window as any;
    const key = 'EQUINOR_FUSION_HISTORY_CONTEXT';

    if (typeof win[key] !== undefined && win[key]) {
        return win[key] as React.Context<IHistoryContext>;
    }

    const fusionContext = createContext<IHistoryContext>({ history: null });
    win[key] = fusionContext;
    return fusionContext;
};

const HistoryContext = ensureGlobalFusionHistoryContextType();

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
