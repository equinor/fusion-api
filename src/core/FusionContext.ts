import { createContext } from "react";
import { IAuthContainer } from "../auth/AuthContainer";
import Resources from "./resources";
import ApiClients from "./ApiClients";

type Auth = {
    container: IAuthContainer;
};

export interface IFusionContext {
    auth: Auth;
    resources: Resources;
    apiClients: ApiClients;
};

export default createContext<IFusionContext | null>(null);