import { useFusionContext } from "../../core/FusionContext";

export default () => {
    const { http } = useFusionContext();
    return http.apiClients;
};