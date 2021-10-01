import useApiClients from '../useApiClients';
import { useCallback } from 'react';
import { Sheet } from '../../../http/apiClients/models/fusion/dataExport/Sheet';

/**
 * A hook that will return a client function that can be used to create Excel documents.
 * The hook will send a `POST` request to the data export API and receive a URL where the generated
 * Excel file can be downloaded. 
 * @param props Name of the file and the name of the Excel sheet
 * @returns A client that accepts the table data as parameters and send a request to the data export API
 * @example
 * import {Table, Toolbar} from "@equinor/fusion-react-table"
 * import {useExcelExport} from "@equinor/fusion"
 * const App = () => {
 *  const {client} = useExcelExport({fileName: 'test', dataSetName: 'test-set'});
 *
 *  return (
 *      <Table
            options={{ columns: columns, data: data, exportFn: client }}
            slots={{ Toolbar: <Toolbar hideExcelBtn={false} /> }}
        />
 *
 *  )
 * }
 *
 */
export const useTableExport = (props: { fileName: string; dataSetName: string }) => {
    const { fusion } = useApiClients();
    const { fileName, dataSetName } = props;

    const client = useCallback(
        (data: { sheets: Sheet[] }): Promise<{ url: string; fileName: string }> => {
            return fusion.getExcelStatusInterval({
                fileName,
                dataSetName,
                sheets: data.sheets,
            });
        },
        [fusion, fileName, dataSetName]
    );

    return { client };
};
export default useTableExport;
