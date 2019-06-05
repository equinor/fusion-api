import { useFusionContext } from "../core/FusionContext";

export default class AbortControllerManager {
    private currentAbortController: AbortController | null = null;

    withAbortController<T>(abortableAction: () => Promise<T>) : () => void {
        this.currentAbortController = new AbortController();

        abortableAction().then(() => {
            this.currentAbortController = null;
        });

        return this.currentAbortController.abort;
    }

    getCurrentSignal() {
        if(this.currentAbortController === null) {
            return null;
        }

        return this.currentAbortController.signal;
    }
}

/**
 * Returns a function to be called if the request(s) performed within the passed function should be aborted
 * @param abortableAction A function that performs requests using the HttpClient somehow
 */
export const withAbortController = <T>(abortableAction: () => Promise<T>)  : () => void => {
    const fusionContext = useFusionContext();
    return fusionContext.abortControllerManager.withAbortController(abortableAction);
};