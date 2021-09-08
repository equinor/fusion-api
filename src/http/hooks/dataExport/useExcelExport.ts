import useApiClients from '../useApiClients';
import { useCallback, useEffect, useState } from 'react';

type Sheet = {
    columns: {
        name: string;
        type: string;
    }[];
    rows: string[][];
};

export const useTableExport = (props: { fileName: string; dataSetName: string }) => {
    const { dataExport } = useApiClients();
    const [url, setUrl] = useState<string>('');
    const { fileName, dataSetName } = props;

    const client = useCallback(
        async (data: { sheets: Sheet[] }) => {
            try {
                const {
                    data: { tempId },
                } = await dataExport.createExcelFile({
                    fileName,
                    dataSetName,
                    sheets: data.sheets,
                });
                setUrl(`/api/data-exports/${tempId}.xlsx`);
            } catch (err) {
                console.error(err);
            }
        },
        [dataExport, fileName]
    );

    useEffect(() => {
        if (!url) return;

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = `https://pro-s-portal-pr-2713.azurewebsites.net${url}`;
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
