import { withAbortController } from '@equinor/fusion';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook for making HTTP requests abortable
 * @typeParam T Specifies the types of input parameters of the HTTP callback function `cb`
 * @param cb Callback function to be made abortable. Must execute an HTTP request
 * @param onAbort Custom handler for abort event
 * @returns HTTP callback function wrapped as an abortable callback
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
            ref.current = abortable(async (signal: AbortSignal) => {
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
