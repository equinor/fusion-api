import * as React from 'react';
import { default as ApiAppManifest } from '../http/apiClients/models/fusion/apps/AppManifest';

type AppManifest = ApiAppManifest & {
    AppComponent: React.ComponentType;
};

export default AppManifest;
