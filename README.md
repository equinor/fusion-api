Fusion
===================

Everything a Fusion app needs to communicate with the core.

[![Version](https://img.shields.io/npm/v/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![Downloads/week](https://img.shields.io/npm/dw/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![License](https://img.shields.io/npm/l/@equinor/fusion.svg)](https://github.com/equinor/fusion/blob/master/package.json)

* [Install](#install)
* [Usage](#usage)

# Install

### Yarn
```sh-session
$ yarn add @equinor/fusion
```

### NPM
```sh-session
$ npm install @equinor/fusion --save
```


# Usage as App Developer

```javascript
import React from "react";
import { useCurrentUser } from "@equinor/fusion";

const MyComponent = () => {
    const currentUser = useCurrentUser();
    
    return (
        <h1>Hi {currentUser.name}!</h1>
    );
};

export default MyComponent; 

```

# Usage as Core

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
};

const authContainer = new AuthContainer();
authContainer.handleWindowCallback();

// Register the main fusion AAD app (get the client id from config)
if(!authContainer.registerApp("{client-id}", [serviceResolver.getDataProxyUrl()])) {
    authContainer.login("{client-id}");
} else {

    const Root = () => {
        const root = useRef();
        const overlay = useRef();
        const fusionContext = createFusionContext(authContainer, serviceResolver, { root, overlay });

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
```