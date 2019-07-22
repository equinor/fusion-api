import { useFusionContext } from "../core/FusionContext";

type AbortDispatcher = () => void;

export default class AbortControllerManager {
    private currentAbortController: AbortController | null = null;

    withAbortController(abortableAction: (signal: AbortSignal) => Promise<void>): AbortDispatcher {
        const abortController = new AbortController();
        this.currentAbortController = abortController;

        abortableAction(abortController.signal).then(() => {
            this.currentAbortController = null;
        });

        return () => abortController.abort();
    }

    getCurrentSignal() {
        if (this.currentAbortController === null) {
            return null;
        }

        return this.currentAbortController.signal;
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
