Fusion
===================

Everything a Fusion app needs to communicate with the core.

[![Version](https://img.shields.io/npm/v/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![Downloads/week](https://img.shields.io/npm/dw/@equinor/fusion.svg)](https://npmjs.org/package/@equinor/fusion)
[![License](https://img.shields.io/npm/l/@equinor/fusion.svg)](https://github.com/equinor/fusion/blob/master/package.json)

* [Install](#install)
* [Usage](#usage)

# Install

## Yarn
```sh-session
$ yarn add @equinor/fusion
```

## NPM
```sh-session
$ npm install @equinor/fusion --save
```

# Usage

```javascript
import { AuthContainer } from "@equinor/fusion";

const authContainer = new AuthContainer();
```