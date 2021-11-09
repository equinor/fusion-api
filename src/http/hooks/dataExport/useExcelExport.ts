import useApiClients from '../useApiClients';
import { useCallback } from 'react';
import { Sheet } from '../../../http/apiClients/models/fusion/dataExport/Sheet';
import FusionClient from '../../../http/apiClients/FusionClient';

/**
 * Type for the handlers argument for {@link useTableExport useTableExport} hook.
 * Pass this object to handle states of the export, for example handling errors.
 */
export type TableExportHandlers = {
    /** Method to handle errors when exporting.*/
    onError?: (e: Error) => void;

    /** Method to handle successful exports.*/
    onSuccess?: (result: { url: string; fileName: string }) => void;

    /** Method to handle a completed export.*/
    onCompleted?: () => void;
};

/**
 * Type for pollingOptions argument for {@link useTableExport useTableExport} hook.
 * Use this to change default polling behavior which will be one request per second for 15 seconds.
 */
export type PollingOptions = {
    /**
     *  How many retries the `GET` call should get before a timeout error occurs.
     * @defaultValue 15.
     */
    retries?: number;

    /**
     * The interval between each `GET` call.
     *  @defaultValue 1000ms
     */
    polling?: number;
};

/**
 * A hook that will return a client function that is to be used for creating Excel documents.
 * The hook will send a `POST` request to the data export API and receive a URL where the generated
 * Excel file can be downloaded. The export state has to be set to "Completed" before being able to download the document.
 * The client returned from the hook will handle the polling, but its default polling behaviour can be changed if needed.
 * @param props - Name of the file and the name of the Excel sheet
 * @param handlers - An object with methods that will handle failure, success and completion of the export. Memoize this object when passing it as an argument
 * @param pollingOptions - Changes the default polling behaviour (one retry every second for 15 seconds)
 * @example
 * ```jsx
 * import {Table, Toolbar} from "@equinor/fusion-react-table"
 * import {useExcelExport, useNotificationCenter} from "@equinor/fusion"
 * const App = () => {
 * const sendNotification = useNotificationCenter();
 * const handlers = useMemo<TableExportHandlers>(() => ({
 *  onError: (e: Error) => {
 *      sendNotification({
 *          level: 'low',
 *          title: `An error ${err.message}`
 *      })
 *  }
 * }), [sendNotification]
 * );
 * const pollingOptions = {
 *      retries: 20,
 *      polling: 2000,
 * };
 *  const {client} = useExcelExport({fileName: 'test', dataSetName: 'testSet'}, handlers, pollingOptions );
 *
 *  return (
 *      <Table
            options={{ columns: columns, data: data, exportFn: client }}
            slots={{ Toolbar: <Toolbar hideExcelBtn={false} /> }}
        />
 *
 *  )
 * }
 * ```
 */
export const useTableExport = (
    props: { fileName: string; dataSetName: string },
    handlers?: TableExportHandlers,
    pollingOptions?: PollingOptions
): ((data: { sheets: Sheet[] }) => ReturnType<FusionClient['getExcelStatusInterval']>) => {
    const { fusion } = useApiClients();
    const { fileName, dataSetName } = props;

    const client = useCallback(
        async (data: { sheets: Sheet[] }) => {
            try {
                const result = await fusion.getExcelStatusInterval(
                    {
                        fileName,
                        dataSetName,
                        sheets: data.sheets,
                    },
                    pollingOptions
                );
                handlers?.onSuccess && handlers.onSuccess(result);
                return result;
            } catch (e) {
                handlers?.onError && handlers.onError(e as Error);
                throw e;
            } finally {
                handlers?.onCompleted && handlers.onCompleted();
            }
        },
        [fusion, fileName, dataSetName, handlers]
    );

    return client;
};

export default useTableExport;
