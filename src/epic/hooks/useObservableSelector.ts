import { useState, useLayoutEffect } from 'react';

import { Observable } from 'rxjs';
import { pluck, distinctUntilChanged, tap } from 'rxjs/operators';

/**
 * Hook selector for attribute on a observable
 *
 * @param state$
 * @param property
 * @param options
 */
export const useObservableSelector = <S, P extends keyof S>(
    state$: Observable<S>,
    property: P,
    options?: {
        compare?: (x: S[P], y: S[P]) => boolean;
        initial?: S[P];
    }
): S[P] | undefined => {
    const [state, setState] = useState<S[typeof property] | undefined>(options?.initial);

    useLayoutEffect(() => {
        const subscription = state$
            .pipe(pluck(property), distinctUntilChanged(options?.compare))
            .subscribe(setState);
        return () => subscription.unsubscribe();
    }, [state$, property]);
    return state;
};

export default useObservableSelector;
