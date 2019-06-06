import { useEffect } from "react";
import { withAbortController } from "../utils/AbortControllerManager";

export default <T>(value: T, abortableAction: (value: T) => Promise<void>, delay: number = 300) => {
    useEffect(() => {
        let abort: (() => void) | null = null;
        const timer = setTimeout(() => {
            abort = withAbortController(async () => await abortableAction(value));
        });

        return () => {
            if(abort !== null) {
                abort();
            }

            clearTimeout(timer);
        }
    }, [value, delay, abortableAction]);
};