import { useFusionContext } from '../core/FusionContext';
import { IEventHub } from './EventHub';
import DistributedState from './DistributedState';
import EventEmitter from './EventEmitter';

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

type AsyncOperation<T> = (abortSignal?: AbortSignal) => T;

/**
 * Enqueue an operation to be run after the next repaint
 * @param operation
 * @param abortSignal
 */
const enqueueAsyncOperation = <T = void>(
    operation: AsyncOperation<T>,
    abortSignal?: AbortSignal
): Promise<T> => {
    return new Promise((resolve, reject) => {
        if (abortSignal?.aborted) {
            return reject();
        }

        window.requestAnimationFrame(() => {
            if (abortSignal?.aborted) {
                return reject();
            }

            setTimeout(async () => {
                if (abortSignal?.aborted) {
                    return reject();
                }

                try {
                    const result = operation();
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            }, 0);
        });
    });
};

export {
    useAbortControllerManager,
    withAbortController,
    enqueueAsyncOperation,
    AbortableAction,
    AsyncOperation,
};
