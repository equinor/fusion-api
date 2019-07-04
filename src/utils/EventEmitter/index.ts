import { useState, useEffect, Dispatch, SetStateAction } from "react";

type Parameter<T> = T extends (arg: infer T) => any ? T : never;

type Handler<TEvents extends Events, TKey extends keyof TEvents = keyof TEvents> = {
    key: TKey;
    handler: (arg: Parameter<TEvents[TKey]>) => void;
};

type Events = {
    [key: string]: (arg: any) => void;
};

export default abstract class EventEmitter<TEvents extends Events> {
    private handlers:  Handler<TEvents>[] = [];

    on<TKey extends keyof TEvents>(
        key: TKey,
        handler: (arg: Parameter<TEvents[TKey]>) => void
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

    protected emit<TKey extends keyof TEvents>(key: TKey, arg: Parameter<TEvents[TKey]>): this {
        const handlers = this.handlers.filter(h => h.key === key);

        handlers.forEach(handler => {
            const handlerFunction = handler.handler as TEvents[TKey];
            handlerFunction(arg);
        });

        return this;
    }
}

export const useEventEmitterValue = <TEvents extends Events, TKey extends keyof TEvents>(
    emitter: EventEmitter<TEvents>,
    event: TKey,
    transform: (value: Parameter<TEvents[TKey]>) => Parameter<TEvents[TKey]> | null = value => value
): [Parameter<TEvents[TKey]> | null, Dispatch<SetStateAction<Parameter<TEvents[TKey]> | null>>] => {
    const [value, setValue] = useState<Parameter<TEvents[TKey]> | null>(null);

    useEffect(() => {
        return emitter.on(event, data => setValue(transform(data)));
    }, [emitter, event]);

    return [value, setValue];
};
