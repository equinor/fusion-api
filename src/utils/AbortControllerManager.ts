import { useFusionContext } from "../core/FusionContext";

export default class AbortControllerManager {
    private currentAbortController: AbortController | null = null;

    withAbortController(abortableAction: () => Promise<void>): () => void {
        var abortController = new AbortController();
        this.currentAbortController = abortController;

        abortableAction().then(() => {
            this.currentAbortController = null;
        });

        return abortController.abort;
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

/**
 * Returns a function to be called if the request(s) performed within the passed function should be aborted
 * @param abortableAction A function that performs requests using the HttpClient somehow
 */
const withAbortController = (abortableAction: () => Promise<void>): (() => void) => {
    const abortControllerManager = useAbortControllerManager();
    return abortControllerManager.withAbortController(abortableAction);
};

export { useAbortControllerManager, withAbortController };
