import { IEventHub } from './EventHub';
import EventEmitter, { IEventEmitter } from './EventEmitter';

export interface IDistributedState<T> extends IEventEmitter<DistributedStateEvents<T>> {
    state: T;
}

export type DistributedStateEvents<T> = {
    change: (state: T) => void;
}

class DistributedState<T> extends EventEmitter<DistributedStateEvents<T>> implements IDistributedState<T> {
    private _state: T;
    private readonly _key: string;
    private readonly _eventHub: IEventHub;

    constructor(key: string, state: T, evenHub: IEventHub) {
        super();
        this._key = key;
        this._state = state;
        this._eventHub = evenHub;
        evenHub.registerListener<T>(key, this.handleUpdatedState);
    }

    get state() {
        return this._state;
    }

    set state(state: T) {
        this._state = state;
        this._eventHub.publish(this._key, state);
    }

    private handleUpdatedState(state: T) {
        this._state = state;
        this.emit('change', this._state);
    }
}

export default DistributedState;