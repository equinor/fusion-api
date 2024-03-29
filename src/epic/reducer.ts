import {
    Subject,
    Subscription,
    BehaviorSubject,
    asyncScheduler,
    PartialObserver,
    Unsubscribable,
    Observable,
    Subscribable,
} from 'rxjs';
import { map, distinctUntilChanged, observeOn, catchError, pairwise } from 'rxjs/operators';

import { Epic, Action } from './epic';
import { StatefulObserver } from './StatefulObserver';

export type Reducer<S, A> = (prevState: S, action: A) => S;
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A>
    ? A
    : never;

/**
 * State machine
 */
export class EpicReducer<
    S,
    A extends Action = any,
    R extends Reducer<S, A> = Reducer<S, A>,
    D = any
> implements Subscribable<S>, Unsubscribable
{
    private readonly _state$: BehaviorSubject<S>;
    private readonly _action$: Subject<A>;
    private readonly _subscription: Subscription;

    /** current state */
    get value(): S {
        return this._state$.value;
    }

    /** observable state */
    get state$(): Observable<S> {
        return this._state$.asObservable();
    }

    /** observable actions */
    get action$(): Observable<A> {
        return this._action$.asObservable();
    }

    /** transaction of state changes */
    get transaction$(): Observable<[S, S]> {
        return this._state$.pipe(pairwise());
    }

    constructor(
        readonly reducer: (s: S) => R,
        readonly epic: Epic<A, A, S>,
        readonly initial: S,
        readonly dependencies: D
    ) {
        this._state$ = new BehaviorSubject(initial);
        this._action$ = new Subject<A>();
        this._subscription = this._subscribe();
    }

    /**
     * internal subscription
     */
    protected _subscribe(): Subscription {
        const reducer = this.reducer(this.initial);
        const reduce$ = this._action$.pipe(
            map((action) => reducer(this._state$.value, action)),
            distinctUntilChanged()
        );

        const state$ = new StatefulObserver(this._state$, this.initial);
        const epic$ = this.epic(this._action$, state$, this.dependencies).pipe(
            catchError((err, caught) => {
                console.error('Unhandled Exception!', err);
                return caught;
            }),
            observeOn(asyncScheduler)
        );

        const subscription = new Subscription();
        subscription.add(reduce$.subscribe(this._state$));
        subscription.add(epic$.subscribe(this._action$));

        return subscription;
    }

    /**
     * Subscribe to state changes of the epic
     * @example
     * ```ts
     * epic.subscribe(x => console.log(x));
     * epic.subscribe({
     *  next: x => console.log(x),
     *  error: x => console.error(x),
     *  complete: () => console.log('closed')
     * });
     * ```
     * @param observerOrNext
     * @param error
     * @param complete
     */
    subscribe(
        observerOrNext?: PartialObserver<S> | ((value: S) => void) | null,
        error?: ((value: S) => void) | null,
        complete?: VoidFunction | null
    ): Subscription {
        return typeof observerOrNext === 'object'
            ? this._state$.subscribe(observerOrNext!)
            : this._state$.subscribe(observerOrNext, error!, complete!);
    }

    /**
     * close epic
     */
    unsubscribe(): void {
        this._subscription.unsubscribe();
    }

    /**
     * dispatch action to process
     * @param action
     */
    dispatch(action: A) {
        if (!this._action$.closed) {
            this._action$.next(action);
        }
    }
}

export default EpicReducer;
