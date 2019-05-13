import { useState, useContext } from "react";
import useEffectAsync from "../../hooks/useEffectAsync";
import FusionContext from "../../core/FusionContext";
import ApiClients from "../apiClients";

type InvokeApiClient<T> = (apiClients: ApiClients) => Promise<T>;

export default <T>(
    invoke: InvokeApiClient<T>,
    dependencies?: any[]
): [boolean, T | null] => {
    const [isFeching, setIsFetching] = useState(false);
    const [data, setData] = useState<T | null>(null);
    const fusionContext = useContext(FusionContext);

    useEffectAsync(async () => {
        setIsFetching(true);
        const result = await invoke(fusionContext.http.apiClients);
        setData(result);
        setIsFetching(false);
    }, dependencies);

    return [isFeching, data];
};
