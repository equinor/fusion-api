import { merge } from 'rxjs';
import { Epic, Action } from './epic';

/**
 * Merges all epics into a single one.
 */
export function combineEpics<T extends Action = Action, O extends T = T, S = void, D = unknown>(
    ...epics: Epic[]
): Epic<T, O, S, D> {
    const merger = (...args: Parameters<Epic>) =>
        merge(
            ...epics.map((epic) => {
                const output$ = epic(...args);
                if (!output$) {
                    throw new TypeError(
                        `combineEpics: one of the provided Epics "${
                            epic.name || '<anonymous>'
                        }" does not return a stream. Double check you're not missing a return statement!`
                    );
                }
                return output$;
            })
        );

    return merger;
}
