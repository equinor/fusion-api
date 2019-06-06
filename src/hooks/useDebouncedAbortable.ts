import { useEffect } from "react";
import { withAbortController } from "../utils/AbortControllerManager";

export default <T>(abortableAction: (value: T) => Promise<void>, value: T, delay: number = 300) => {
    const abortable = withAbortController();

    useEffect(() => {
        let abort: (() => void) | null = null;
        const timer = setTimeout(() => {
            abort = abortable(async () => await abortableAction(value));
        }, delay);

        return () => {
            if(abort !== null) {
                abort();
            }

            clearTimeout(timer);
        }
    }, [value, delay, abortableAction]);
};