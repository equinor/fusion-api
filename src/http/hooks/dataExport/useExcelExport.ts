import useApiClients from '../useApiClients';
import { useCallback, useEffect, useState } from 'react';
import { useFusionContext } from '../../../core/FusionContext';
import { Sheet } from '../../../http/apiClients/models/fusion/dataExport/Sheet';

/**
 * A hook that will return a client function that can be used to create Excel documents.
 * The hook will send a `POST` request to the data export API and receive a URL where the generated
 * Excel file can be downloaded. After receiving the URL, an anchor tag will be added and the download will start.
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
            options={{ columns: columns, data: data }}
            slots={{ Toolbar: <Toolbar excel={{ client }} /> }}
        />
 *
 *  )
 * }
 *
 */
export const useTableExport = (props: { fileName: string; dataSetName: string }) => {
    const { fusion } = useApiClients();
    const {
        http: { resourceCollections },
    } = useFusionContext();
    const [url, setUrl] = useState<string>('');
    const { fileName, dataSetName } = props;

    const client = useCallback(
        async (data: { sheets: Sheet[] }) => {
            try {
                const {
                    data: { tempId },
                } = await fusion.createExcelFile({
                    fileName,
                    dataSetName,
                    sheets: data.sheets,
                });
                setUrl(`${resourceCollections.fusion.downloadExcel(tempId)}.xlsx`);
            } catch (err) {
                console.error(err);
            }
        },
        [fusion, fileName]
    );

    useEffect(() => {
        if (!url) return;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName + '.xlsx';
        document.body.appendChild(a);
        a.click();
        return () => {
            a.remove();
        };
    }, [url]);

    return { client };
};
export default useTableExport;
