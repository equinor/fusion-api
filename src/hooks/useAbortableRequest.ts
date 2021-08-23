import { withAbortController } from '@equinor/fusion';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook for making HTTP requests abortable
 */

export const useAbortableRequest = <T extends Array<unknown>>(
    cb: (...args: T) => void,
    onAbort?: ((this: AbortSignal, ev: Event) => any) | null
) => {
    const abortable = withAbortController();
    const ref = useRef<VoidFunction>();
    const abortableRequest = useCallback(
        (...argss: T) => {
            ref.current && ref.current();
            ref.current = abortable(async (signal) => {
                onAbort && (signal.onabort = onAbort);
                if (signal.aborted) return;
                return cb(...argss);
            });
        },
        [cb, ref]
    );

    useEffect(() => ref.current, [ref.current]);

    return abortableRequest;
};

export default useAbortableRequest;
