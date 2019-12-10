import { ContextManifest, Context } from '../../context';

export type AppAuth = {
    clientId: string;
    resources: string[];
};

type AppManifest = {
    key: string;
    name: string;
    shortName: string;
    version: string;
    description: string;
    tags: string[];
    context?: ContextManifest;
    auth?: AppAuth;
    icon?: string;
    buildURL?: (context: Context) => string;
    getContextFromUrl?: (url: string) => string;
};

export default AppManifest;
