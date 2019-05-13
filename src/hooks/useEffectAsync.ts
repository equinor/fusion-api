import { useEffect } from "react";

type AsyncEffectCallback = () => Promise<(() => void) | void>;

export default (effect: AsyncEffectCallback, dependencies?: any[]): void => {
    const invoke = (promise: Promise<(() => void) | void>): void => {
        promise.then(result => {
            if (typeof result === "function") {
                result();
            }
        });
    };

    useEffect(() => {
        const promise = effect();
        return () => invoke(promise);
    }, dependencies);
};