import { AppManifest } from "./AppManifest";

export declare type AppRegistrationListener = (appKey: string, manifest: AppManifest) => void;
export declare type AppRegistrationUnsubscribe = () => void;
