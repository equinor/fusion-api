type Handler<TEvents, TKey extends keyof TEvents = keyof TEvents, THandler = TEvents[TKey]> = {
    key: TKey;
    handler: THandler;
};

type Handlers<TEvents> = Handler<TEvents>[];

export default abstract class EventEmitter<TEvents> {
    private handlers: Handlers<TEvents> = [];

    on<TKey extends keyof TEvents>(key: TKey, handler: TEvents[TKey]): () => void {
        const registeredHandler = {
            key,
            handler,
        };

        this.handlers.push(registeredHandler);

        return () => {
            const index = this.handlers.indexOf(registeredHandler);
            this.handlers.splice(index, 1);
        };
    }

    protected emit<TKey extends keyof TEvents>(key: TKey, ...args: any[]): this {
        const handlers = this.handlers.filter(h => h.key === key);

        handlers.forEach(handler => {
            const handlerFunction = (handler.handler as unknown) as Function;
            handlerFunction(...args);
        });

        return this;
    }
}
