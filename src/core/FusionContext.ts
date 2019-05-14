import { createContext, useContext, MutableRefObject } from "react";
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

type Refs = {
    root: MutableRefObject<HTMLElement>;
    overlay: MutableRefObject<HTMLElement>;
};

export interface IFusionContext {
    auth: Auth;
    http: Http;
    refs: Refs;
}

const FusionContext = createContext<IFusionContext>({} as IFusionContext);

export const useFusionContext = () => useContext(FusionContext);

export default FusionContext;
