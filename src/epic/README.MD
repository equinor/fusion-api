# Epic

> **Not familiar with Observables/RxJS?**
> observable requires an understanding of Observables with RxJS. 
> If you're new to Reactive Programming with RxJS v6, head over to http://reactivex.io/rxjs/ to familiarize yourself first.

## Core concepts
Help separate presentation from business logic, to easily implement `BLoC` Design Pattern (_Business Logic Component_). This package abstracts reactive aspects of the pattern allowing developers to focus on writing the business logic.

**Publisher** (producer|sink) 
> When a `action` is trigged, a `event` is produced and published to the stream.

**Stream** 
> The fabric between the publisher and subscriber contains a `flow` of facts. Streams can be `piped` or merged into new streams but never altered.

**Subscriber** (consumer|drain) 
> Subscribers consumes a stream. Reducing a stream into a `state` will remain in `flux` since it will change depending of the window of time on observation.

The idea is that any component can dispatch an event or consume data without knowing the logic behind. This also makes it more independent and easier to refactor. The logic is also removed from the framework (UI) and can be implemented in different frameworks. UI components should be as stateless as possible.

While events are asyncronious be nature, the reaction is syncronious to prevent flux, so all actions are processed in the order they were recived. After mapping the action to state, epics are called as a side effect which may produce new actions. Components can subscribe to actions or transactions and react to changes.

### advantages
Observables are still just in draft for ECMA, but several frameworks have implemented their own version of it. We are using RXJS which is the state enginge of angular, so any developer with knowlege of angular or flutter should feel kinda familiar.

While functions can be composed and objects can be inherited, streams has the advantage of allowing subscriptions and plumbing (composition of asynchronous iterator pattern). Normaly one need to propagate when changing functionality, but with streams one simply modifies the flow with operators. 

What makes RxJS powerful is its ability to produce values using pure functions, which means data within the stream is immutable. Normally you would create an impure function, where other pieces of your code can mess up your state.

## Introduction

An Epic is a function which takes a stream of actions and returns a stream of actions. Actions in, actions out.

It has roughly this type signature:
```ts
function (action$: Observable<Action>, state$: StateObservable<State>): Observable<Action>;
```

While you'll most commonly produce actions out in response to some action you received in, that's not actually a requirement! Once you're inside your Epic, use any Observable patterns you desire as long as any output from the final, returned stream, is an action.

The actions you emit will be immediately dispatched through the normal store.dispatch(), so under the hood redux-observable effectively does epic(action$, state$).subscribe(store.dispatch)

Epics run alongside the normal `Reducer` dispatch channel, after the reducers have already received them--so you cannot "swallow" an incoming action. Actions always run through your reducers before your Epics even receive them.

If you let an incoming action pass through, it will create an infinite loop:
```ts
// DO NOT DO THIS
const actionEpic = action$ => action$; // creates infinite loop
```
> *The pattern of handling side effects this way is similar to the "process manager" pattern, sometimes called a [saga](https://docs.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)*

## A Basic Example
> **IMPORTANT:**
> Our examples will not include any imports from rxjs. 
> Under normal circumstances, all operators (the functions used within the pipe() method) must be imported like `import { filter, mapTo } from 'rxjs/operators'`;
>
> We recomend using the `typesafe-actions` package for creating actions

```ts
import { createReducer, createAction, ActionType, isActionOf } from 'typesafe-actions';

type State = { value: string };
const initial: State = { value: '' };

const actions = {
  ping: createAction('PING')<void>(),
  pong: createAction('PONG')<void>(),
}
type Actions = ActionType<typeof actions>;


const epic = (action$: Observable<Actions>) => action$.pipe(
  filter(isActionOf(actions.ping)),
  mapTo(actions.pong())
);

const reducer = createReducer<State, Actions>(initial)
  .handleAction(actions.ping, (state, action) => ({ value: action.type })
  .handleAction(actions.pong, (state, action) => ({ value: action.type })

const store = new EpicReducer(reducer, epic, initial);

store.dispatch(action.ping());

store.subscribe(console.log); // ...ping...pong
```
>*Noticed how action$ has a dollar sign at the end? It's simply a common RxJS convention to identify variables that reference a stream.*

The real power comes when you need to do something asynchronous. Let's say you want to dispatch `PONG` 1 second after receiving the `PING`:

```ts
const epic = (action$: Observable<Actions>) => action$.pipe(
  filter(isActionOf(actions.ping)),
  delay(1000),
  mapTo(actions.pong())
);
```

### Transactions
In many usescases one would like to no the previous value and the next value. Epics easily resolves this:
```ts
// store has a shorthand porperty for accessing state transactions
store.transaction$.subscribe(console.log); // ['', 'ping'], ['ping', 'pong']

// any observable can emit transactions
store.action$.pipe(pairwise()).subscribe(console.log); // [null, actions.ping], [actions.ping, actions.pong]
```

## More Complex
client.ts
```ts
const client = {
  fetchUser: async(id: string) => {
    try {
      const response = await fetch(`/api/user/${id}`);
      return response.json();
    } catch(error) {
      const message = (() => {
        switch (error.StatusCode) {
          case 403:
            return 'You do not have access :(';
          case 404:
            return 'Could not find user';
          default:
            return 'Could not load general report info';
        }
      })();
      throw Error(message)
    }
  }
}
```

actions.ts\
_Actions should be prefix with domain and written inn all caps with snake case_
```ts
const fetchUser = createAsyncAction(
  '@USERS/FETCH_USER_REQUEST',
  '@USERS/FETCH_USER_SUCCESS',
  '@USERS/FETCH_USER_FAILURE',
  '@USERS/FETCH_USER_CANCEL',
)<string, UserObject, Error, void>();
```
> notice how all action are created into a single object.

epic.ts
```ts
type Depencies = { client: typeof client };
const userEpic = (
  action$: Observable<Actions>,
  state$: StatefulObserver<State>,
  { client }: Depencies
) => action$.pipe(
  filter(isActionOf(fetchUser.request)),
  // cancel ongoing request if a new is made
  switchMap(action => from(client.fetchUser(action.payload)).pipe(
    map(res => fetchUser.success(res)),
    // handle api execptions, note errors need new observable
    catchError(err => of(fetchUser.failure(err))),
    // close pipe when cancel action is dispatched
    takeUntil(action$.pipe(
      filter(isActionOf(fetchUser.cancel))
    ))
  ))
);
```

reducer.ts
```ts
const userReducer = createReducer<State, Actions>(initial)
  // clear state and mark as fetching data
  .handleAction(fetchUser.request, (state, action) => ({ fetching: true })
  // add user to state
  .handleAction(fetchUser.success, (state, action) => ({ user: action.payload })
  // add error to state
  .handleAction(fetchUser.failure, (state, action) => ({ error: action.payload })
  // clear fetch indicator
  .handleAction(fetchUser.cancel, (state, action) => ({ ...state, fetching: false  })
```

user.tsx
```tsx
const initial = {};
const dependencies= {client};
const User: FunctionComponent = ({userId}) => {

  // the hook will memoize a store
  const store = useEpic(userReducer, userEpic, initial, dependencies);
  
  // the hook will subscribe/unsubscribe to observable stream
  const { user, error, fetching } = useObservableState(store.state$);
  
  // request user
  useEffect(() => {
    store.dispatch(fetchUser.request(userId));
    return () => store.dispatch(fetchUser.cancel(userId));
  }, [store, userId]);

  if(error){
    return (<p>{error}</p>);
  }

  if(fetching){
    return (<p>fetching</p>);
  }

  return (<p>{user.name}</p>);
}
```

### store
```ts
type State = { 
  user?: UserObject; 
  error?: Error;
  fetching?: boolean;  
};

const initial: State = { };

class UserStore extends EpicReducer<State, Actions> {
  fetch(id: string) {
    this.dispatch(fetchUser.request(id));
    return () => this.dispatch(fetchUser.cancel());
  }
}

createUserStore = (): Store => {
  const initial = {};
  const dependencies= {client};
  return new Store(reducer(initial), userEpic, initial, dependencies);
}
```

```tsx
const User: FunctionComponent = (userId) => {
  const store = useMemo(() => createUserStore(), []);
  const user = useSelector(store, 'user');
  const error = useSelector(store, 'error');
  const fetching = useSelector(store, 'fetching');
  
  // request user, note abort call on unmount
  useEffect(() => store.fetch(userId), [store, userId]);

  if(error){
    return (<p>{error}</p>);
  }
  if(fetching){
    return (<p>fetching</p>);
  }
  return (<p>{user.name}</p>);
}
```

## Accessing the Store's State within epic
```ts
// epic.ts
type Depencies = { client: typeof client };
const userEpic = (
  action$: Observable<Actions>,
  state$: StatefulObserver<State>,
  { client }: Depencies
) => {
  const abort$ = action$.pipe(filter(isActionOf(fetchUser.cancel)));
  return action$.pipe(
      filter(isActionOf(fetchUser.request)),
      // accessing state value directly
      switchMap(action => from(client.fetchUser(state$.value.userId)).pipe(
        map(res => fetchUser.success(res)),
        catchError(err => of(fetchUser.failure(err))),
        takeUntil(abort$)
    ))
  );
}

// alternative by using latest from state
action$.pipe(
  filter(isActionOf(fetchUser.request)),
  withLatestFrom(state$),
  switchMap([action, state] => from(client.fetchUser(state.userId)).pipe(
    map(res => fetchUser.success(res)),
    catchError(err => of(fetchUser.failure(err))),
    takeUntil(abort$)
  ))
);
```

## Sharing state between components

```tsx
const context = createContext<UserStore>(null);

const UserProvider = ({children}) => {
   const store = useMemo(() => createUserStore(), []);
   return (<context.Provider value={store}>{children}</context.Provider>)
}

const FetchUser = () => {
  const store = useContext(context);
  return (<button onClick={() => store.fetch(2243)}>Fetch</button>);
}

const ShowUser = () => {
  const store = useContext(context);
  const user = useSelector(store, 'user');
  return (<p>current user: {user.name}</p>);
}

const UserCompoenent = () => {
  return (
    <UserProvider>
      <ShowUser/>
      <FetchUser/>
    </UserProvider>
  );
}
```


## EpicReducer
State machine that manages state and processes actions

## StatefulObserver
Obserable provided to an epic, this works like `behaviorSubject` but without `sink`.

## Helpers

- combineEpics - _combines multiple epics into a single `epic`_
- useEpic - _hook for using an `epic`_
- useSelector - _hook for selecting an attribute of a `epic`_
- useObservableSelector - _hook for selecting an attribute of a `observable`_
