Fusion
===================

Everything a Fusion app needs to communicate with the core.

[![Version](https://img.shields.io/npm/v/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![Downloads/week](https://img.shields.io/npm/dw/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![License](https://img.shields.io/npm/l/@equinor/fusion.svg)](https://github.com/equinor/fusion/blob/master/package.json)

* [Install](#install)
* [Usage as App developer](#usage-as-app-developer)
    * [Current user](#current-user)
    * [Core resources](#core-resources)
    * [Core settings](#core-settings)
    * [App settings](#app-settings)
* [Usage as Core developer](#usage-as-core-developer)
    * [Bootstrap the fusion core](#bootstrap-the-fusion-core)

# Install

### Yarn
```sh-session
$ yarn add @equinor/fusion
```

### NPM
```sh-session
$ npm install @equinor/fusion --save
```


# Usage as App developer

## Current user

```javascript
import React from "react";
import { Spinner } from "@equinor/fusion-components";
import { useCurrentUser } from "@equinor/fusion";

const MyComponent = () => {
    const currentUser = useCurrentUser();

    // Current user might not be retrieved from the cache when the component loads,
    // So check for nulL!
    if(currentUser == null) {
        return <Spinner />;
    }
    
    return (
        <h1>Hi {currentUser.name}!</h1>
    );
};

export default MyComponent; 

```

## Core resources

```javascript
import React from "react";
import { Spinner } from "@equinor/fusion-components";
import { useCurrentContext, ContextTypes, useHandover, useHandoverMcpkgs } from "@equinor/fusion";

const MyHandoverCommpkgDetails = ({ id }) => {
    const currentProject = useCurrentContext(ContextTypes.PDP);
    const [isFetching, handoverMcpkgs] = useHandoverMcpkgs(currentProject, id);
    
    if(isFetching) {
        return <Spinner />;
    }

    return (
        <ul>
            {handoverMcpkgs.map(mcpkg => (
                <li>
                    {mcpkg.mcPkgNo}
                </li>
            ))}
        </ul>
    );
};

const MyHandoverComponent = () => {
    const currentProject = useCurrentContext(ContextTypes.PDP);
    const [isFetching, handoverData] = useHandover(currentProject);
    
    if(isFetching) {
        return <Spinner />;
    }

    return (
        <ul>
            {handoverData.map(handoverItem => (
                <li>
                    <h2>{handoverItem.commpkgNo}</h2>
                    <MyHandoverCommpkgDetails id={handoverItem.id}  />
                </li>
            ))}
        </ul>
    );
};

export default MyComponent; 

```

## Core settings
Core settings are read-only for apps
```javascript
import React from "react";
import { useCoreSettings, ComponentDisplayTypes } from "@equinor/fusion";

const MyComponent = () => {
    const coreSettings = useCoreSettings();

    if(coreSettings.componentDisplayType === ComponentDisplayTypes.Compact) {
        return (<span>Looks like you prefere compact mode!</span>);
    } else {
        return (<h2>Some more spacing for you!</h2>)
    }
};

export default MyComponent; 

```

## App settings
App settings are automatically scoped to the current app
```javascript
import React from "react";
import { Button } from "@equinor/fusion-components";
import { useAppSettings } from "@equinor/fusion";

const MyComponent = () => {
    const [appSettings, setAppSettings] = useAppSettings();

    return (
        <Button
            primary contained
            onClick={() => setAppSettings("toggle", !appSettings.toggle)}
        >
            Click to toggle {appSettings.toggle ? "On" : "Off"}
        </Button>
    );
};

export default MyComponent; 

```

# Usage as Core developer

## Bootstrap the fusion core
```javascript
import React, { useRef } from "react";
import { render } from "react-dom";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import {
    AuthContainer,
    createFusionContext,
    FusionContext,
    ServiceResolver,
} from "@equinor/fusion";

const serviceResolver: ServiceResolver = {
    getDataProxyUrl: () => "http://api.url.com",
    getOrgUrl: () => "http://api.url.com",
};

const start = async () => {
    const authContainer = new AuthContainer();

    // Handle redirect from login
    await authContainer.handleWindowCallbackAsync();

    // Register the main fusion AAD app (get the client id from config)
    const coreAppClientId = "{client-id}";
    const coreAppRegistered = await authContainer.registerAppAsync(
        coreAppClientId,
        [serviceResolver.getDataProxyUrl(), serviceResolver.getOrgUrl()]
    );

    if(!coreAppRegistered) {
        authContainer.login(coreAppClientId);
    } else {

        const Root = () => {
            const root = useRef();
            const overlay = useRef();
            const fusionContext = createFusionContext(
                authContainer,
                serviceResolver,
                { root, overlay, }
            );

            return (
                <Router history={fusionContext.history}>
                    <FusionContext.Provider value={fusionContext}>
                        <div id="fusion-root" ref={rootRef}>
                            {/* The app component goes here */}
                        </div>
                        <div id="overlay-container" ref={overlayRef}>
                            {/* Leave this empty. Used for dialogs, popovers, tooltips etc. */}
                        </div>
                    </FusionContext.Provider>
                </Router>
            );
        };

        render(<Root />, document.getElementById("app"));
    }
};

start();
```

## Hooks

### useAbortableRequest
This hook will make an HTTP callback abortable, i.e allows for cancellation of a pending HTTP request. The HTTP callback in the example below is defined as `executeRequest`, which will make an HTTP request towards some API client. The callback will be made abortable when the callback is passed onto the `useAbortableRequest` hook, with the custom abort signal handler `onAbort`. E.g if the abortable callback `onInput` initiates a request, but the `MyComponents` component is unmounted, the initiated HTTP request will be cancelled.

```tsx
export const MyComponents = () => {
    const {someClient} = useApiClients();
    const [state, setState] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState();
    const executeRequest = useCallback(async(e: Event) => {
        try{
            setLoading(true);
            const response = someClient.getFoo(e.target.value);
            setState(response);
        } catch (e) {
            setError(e.message);
        } finally (){
            setLoading(false);
        }
    }, [someClient]);
    const onAbort = useCallback(() => console.debug('request was aborted'));
    const onInput = useAbortableRequest(executeRequest, onAbort);
    return (
        <div>
            <input type="text" onInput={onInput} />
            <span>${state}</span>
        </div>
}
```