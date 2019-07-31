import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export type Parameter<T extends (arg: any) => void> = T extends (arg: infer P) => void ? P : never;

export type EventHandlerParameter<
    TEvent extends Events,
    TKey extends keyof TEvent,
    THandler extends TEvent[TKey] = TEvent[TKey]
> = THandler extends (arg: infer P) => void ? P : never;

type Handler<TEvents extends Events, TKey extends keyof TEvents = keyof TEvents> = {
    key: TKey;
    handler: (arg: EventHandlerParameter<TEvents, TKey>) => void;
};

export type Events = {
    [key: string]: (arg: any) => void;
};

export default abstract class EventEmitter<TEvents extends Events> {
    private handlers: Handler<TEvents>[] = [];

    on<TKey extends keyof TEvents>(
        key: TKey,
        handler: (arg: EventHandlerParameter<TEvents, TKey>) => void
    ): () => void {
        const registeredHandler: Handler<TEvents> = {
            key,
            handler,
        };

        this.handlers.push(registeredHandler);

        return () => {
            const index = this.handlers.indexOf(registeredHandler);
            this.handlers.splice(index, 1);
        };
    }

    protected emit<TKey extends keyof TEvents, TParameter = EventHandlerParameter<TEvents, TKey>>(
        key: TKey,
        arg: TParameter
    ): this {
        const handlers = this.handlers.filter(h => h.key === key);

        handlers.forEach(handler => {
            const handlerFunction = handler.handler as TEvents[TKey];
            window.requestAnimationFrame(() => handlerFunction(arg));
        });

        return this;
    }
}

export const useEventEmitterValue = <
    TEvents extends Events,
    TKey extends keyof TEvents,
    TData = EventHandlerParameter<TEvents, TKey>
>(
    emitter: EventEmitter<TEvents>,
    event: TKey,
    transform: (value: TData) => TData | null = value => value,
    defaultData: TData | null = null
): [TData | null, Dispatch<SetStateAction<TData | null>>] => {
    const [value, setValue] = useState<TData | null>(null);

    useEffect(() => {
        return emitter.on(event, data => setValue(transform(data)));
    }, [emitter, event]);

    return [value, setValue];
};
