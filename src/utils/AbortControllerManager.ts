import { useFusionContext } from '../core/FusionContext';
import { IEventHub } from './EventHub';
import DistributedState from './DistributedState';
import { EventEmitter } from '..';

type AbortDispatcher = () => void;

type AbortControllerEvents = {
    update: (abortController: AbortController | null) => void;
};

export default class AbortControllerManager extends EventEmitter<AbortControllerEvents> {
    private currentAbortController: DistributedState<AbortController | null>;

    constructor(eventHub: IEventHub) {
        super();
        this.currentAbortController = new DistributedState<AbortController | null>(
            'CurrentAbortController',
            null,
            eventHub
        );

        this.currentAbortController.on('change', (abortController: AbortController | null) => {
            this.emit('update', abortController);
        });
    }

    withAbortController(abortableAction: (signal: AbortSignal) => Promise<void>): AbortDispatcher {
        const abortController = new AbortController();
        this.currentAbortController.state = abortController;

        abortableAction(abortController.signal).then(() => {
            this.currentAbortController.state = null;
        });

        return () => abortController.abort();
    }

    getCurrentSignal() {
        if (this.currentAbortController.state === null) {
            return null;
        }

        return this.currentAbortController.state.signal;
    }
}

const useAbortControllerManager = () => {
    const { abortControllerManager } = useFusionContext();
    return abortControllerManager;
};

type AbortableAction = (signal: AbortSignal) => Promise<void>;

/**
 * Returns a function to be called if the request(s) performed within the passed function should be aborted
 */
const withAbortController = (): ((abortableAction: AbortableAction) => AbortDispatcher) => {
    const abortControllerManager = useAbortControllerManager();

    return (abortableAction: AbortableAction): AbortDispatcher => {
        return abortControllerManager.withAbortController(abortableAction);
    };
};

export { useAbortControllerManager, withAbortController };
