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

const authContainer = new AuthContainer();
if(!authContainer.registerApp("{client-id}", ["http://api.url.com"])) {
    authContainer.login("{client-id}");
} else {
    const serviceResolver: ServiceResolver = {
        getDataProxyUrl: () => "http://api.url.com",
    };

    const fusionContext = createFusionContext(authContainer, serviceResolver);

    const Root = () => (
        <Router history={fusionContext.history}>
            <FusionContext.Provider value={fusionContext}>
                <div id="fusion-root" ref={rootRef}>

                </div>
                <div id="overlay-container" ref={overlayRef}>

                </div>
            </FusionContext.Provider>
        </Router>
    );

    render(<Root />, document.getElementById("app"));
}
```