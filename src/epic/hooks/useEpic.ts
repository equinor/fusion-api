import { useMemo } from 'react';

import { Epic } from '../epic';
import { EpicReducer, Reducer, ReducerAction, ReducerState } from '../reducer';

interface Options<D = any> {
    dependencies?: D;
}

/**
 * Hook for memoizing an epic reducer
 *
 * @param reducer reducer funtion that takes state and action as parameter and return a state
 * @param epic saga
 * @param initial initial state
 * @param options optional arguments for reducer
 */
export const useEpic = <R extends Reducer<any, any>, D = any>(
    reducer: (state: ReducerState<R>) => R,
    epic: Epic<ReducerAction<R>, ReducerAction<R>, ReducerState<R>, D>,
    initial: ReducerState<R>,
    options: Options<D>
) => {
    return useMemo(() => new EpicReducer(reducer, epic, initial, options.dependencies), []);
};

export default useEpic;
