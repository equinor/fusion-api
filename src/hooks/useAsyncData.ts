import { useState } from 'react';
import useEffectAsync from './useEffectAsync';

export type AsyncDataHookResult<T> = [Error | null, boolean, T | null];

type InvokeAsyncDataHook<T> = (signal: AbortSignal) => Promise<T>;

export default <T>(
    invoke: InvokeAsyncDataHook<T>,
    dependencies?: any[]
): AsyncDataHookResult<T> => {
    const [error, setError] = useState<Error | null>(null);
    const [isFeching, setIsFetching] = useState(false);
    const [data, setData] = useState<T | null>(null);

    useEffectAsync(async (signal) => {
        setIsFetching(true);

        try {
            const result = await invoke(signal);
            setData(result);
            setError(null);
        } catch (error) {
            setError(error);
        }

        setIsFetching(false);
    }, dependencies);

    return [error, isFeching, data];
};
