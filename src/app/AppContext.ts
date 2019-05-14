import { createContext } from "react";
import { AppManifest } from "./AppManifest";

export interface IAppContext {
    appKey: string;
    appPath: string;
    manifest: AppManifest | null;
}

export default createContext<IAppContext>({
    appKey: "",
    appPath: "/",
    manifest: null,
});
