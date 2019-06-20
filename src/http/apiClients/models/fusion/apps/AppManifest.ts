import { ContextTypes } from '../../context';

export type AppAuth = {
    clientId: string;
    resources: string[];
};

type AppManifest = {
    contextTypes?: ContextTypes[];
    auth?: AppAuth;
}

export default AppManifest;