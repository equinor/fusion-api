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
        debugger;
        const createdUrl = window.URL.createObjectURL(
            `https://pro-s-portal-pr-2713.azurewebsites.net${url}`
        );
        debugger;
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = createdUrl;
        a.download = `${fileName}.xlsx`;
        document.body.appendChild(a);
        debugger;
        a.click();
        return () => {
            a.remove();

            window.URL.revokeObjectURL(createdUrl);
        };
    }, [url]);

    return { client };
};
export default useTableExport;
