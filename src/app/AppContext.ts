import { createContext, useContext } from "react";
import { AppManifest } from "./AppManifest";

export interface IAppContext {
    appKey: string;
    appPath: string;
    manifest: AppManifest | null;
}

const AppContext = createContext<IAppContext>({
    appKey: "",
    appPath: "/",
    manifest: null,
});

export const useAppContext = () => useContext(AppContext);

export default AppContext;