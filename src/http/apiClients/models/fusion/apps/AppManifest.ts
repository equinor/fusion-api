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
};

export default AppManifest;
