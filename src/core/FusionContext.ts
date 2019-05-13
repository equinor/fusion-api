import { createContext, useContext } from "react";
import { IAuthContainer } from "../auth/AuthContainer";
import ResourceCollections from "../http/resourceCollections";
import ApiClients from "../http/apiClients";

type Auth = {
    container: IAuthContainer;
};

type Http = {
    resourceCollections: ResourceCollections;
    apiClients: ApiClients;
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
}

const FusionContext = createContext<IFusionContext>({} as IFusionContext);

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;