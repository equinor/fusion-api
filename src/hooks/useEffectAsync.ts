import { useEffect } from "react";

export type AsyncEffectCallback<T> = (signal: AbortSignal) => Promise<T>;

export default <T>(effect: AsyncEffectCallback<T>, dependencies?: readonly any[]): void => {
    useEffect(() => {
        const abortController = new AbortController();
        effect(abortController.signal);
        return () => abortController.abort();
    }, dependencies);
};
