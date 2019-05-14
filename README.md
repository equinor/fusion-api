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

# Usage as Core

```javascript
import React, { useRef } from "react";
import { render } from "react-dom";
import { AuthContainer, ServiceResolver, HttpClient, createResourceCollections, createApiClients } from "@equinor/fusion";

const authContainer = new AuthContainer();
if(!authContainer.registerApp("{client-id}", ["http://api.url.com"])) {
    authContainer.login("{client-id}");
    return;
}

const serviceResolver: ServiceResolver = {
    getDataProxyUrl: () => "http://api.url.com",
};

const resourceCollections = createResourceCollections(serviceResolver);

const httpClient = new HttpClient(authContainer);
const apiClients = createApiClients(httpClient, resourceCollections);

const rootRef = useRef(null);
const overlayRef = useRef(null);

const Root = () => (
    <FusionContext.Provider value={{
        auth: { container: authContainer },
        http: {
            resourceCollections,
            apiClients,
        },
        refs: {
            root: rootRef,
            overlay: overlayRef,
        }
    }}>
        <div id="fusion-root" ref={rootRef}>

        </div>
        <div id="overlay-container" ref={overlayRef}>

        </div>
    </FusionContext.Provider>
);

render(<Root />, document.getElementById("app"));
```