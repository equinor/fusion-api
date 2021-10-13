/**
 * Response from data-export service after sending a request to generate an excel doc.
 */
export type DataExportResponse = {
    /**
     * ID for the generated document
     */
    tempKey: string;
    /**
     * When this generated document will expire
     */
    expireDate: Date;
    /**
     * Status of the generating document. Can only be downloaded if it is "Complete".
     */
    exportState: 'New' | 'Complete';
};
/**
 * Timeout error class that is instantiated if a timeout error occurs.
 * Able to pass a custom error message, defaults to "Timeout error".
 */
export class TimeoutError extends Error {
    constructor(message = 'Timeout error') {
        super(message);
    }
}
