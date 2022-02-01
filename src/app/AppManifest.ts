import * as React from 'react';
import { default as ApiAppManifest } from '../http/apiClients/models/fusion/apps/AppManifest';

type AppManifest = ApiAppManifest & {
    AppComponent: React.ComponentType;
    // TODO - WIP: workaround while having fusion API and Fusion Framework
    render?: (fusion: any, env: AppManifest) => React.LazyExoticComponent<React.ComponentType>;
};

export default AppManifest;
