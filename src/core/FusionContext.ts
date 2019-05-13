import { createContext } from "react";
import { IAuthContainer } from "../auth/AuthContainer";
import Resources from "../http/resources";
import ApiClients from "../http/apiClients";

type Auth = {
    container: IAuthContainer;
};

type Http = {
    resources: Resources;
    apiClients: ApiClients;
}

export interface IFusionContext {
    auth: Auth;
    http: Http;
};

export default createContext<IFusionContext | null>(null);