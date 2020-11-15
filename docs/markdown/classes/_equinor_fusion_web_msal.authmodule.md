**[Fusion Core](../README.md)**

> [Globals](../globals.md) / [@equinor/fusion-web-msal](../modules/_equinor_fusion_web_msal.md) / AuthModule

# Class: AuthModule\<Client>

Popup
Use when initiating the login process via opening a popup window in the user's browser

Redirect
This function redirects the page, so any code that follows this function will not execute.
IMPORTANT: It is NOT recommended to have code that is dependent on the resolution of the Promise. This function will navigate away from the current
browser window. It currently returns a Promise in order to reflect the asynchronous nature of the code running in this function.

## Type parameters

Name | Type |
------ | ------ |
`Client` | [AuthClient](../modules/_equinor_fusion_web_msal.md#authclient) |

## Hierarchy

* **AuthModule**

## Index

### Constructors

* [constructor](_equinor_fusion_web_msal.authmodule.md#constructor)

### Properties

* [client](_equinor_fusion_web_msal.authmodule.md#client)

### Accessors

* [account](_equinor_fusion_web_msal.authmodule.md#account)

### Methods

* [acquireToken](_equinor_fusion_web_msal.authmodule.md#acquiretoken)
* [login](_equinor_fusion_web_msal.authmodule.md#login)
* [createInstance](_equinor_fusion_web_msal.authmodule.md#createinstance)

## Constructors

### constructor

\+ **new AuthModule**(`client`: Client): [AuthModule](_equinor_fusion_web_msal.authmodule.md)

*Defined in web/msal/src/module.ts:36*

#### Parameters:

Name | Type |
------ | ------ |
`client` | Client |

**Returns:** [AuthModule](_equinor_fusion_web_msal.authmodule.md)

## Properties

### client

• `Readonly` **client**: Client

*Defined in web/msal/src/module.ts:38*

## Accessors

### account

• get **account**(): Promise\<AccountInfo \| undefined>

*Defined in web/msal/src/module.ts:31*

**Returns:** Promise\<AccountInfo \| undefined>

## Methods

### acquireToken

▸ **acquireToken**(`behavior?`: [AuthBehavior](../modules/_equinor_fusion_web_msal.md#authbehavior), `options?`: [AuthRequest](../modules/_equinor_fusion_web_msal.md#authrequest)): Promise\<AuthenticationResult \| void>

*Defined in web/msal/src/module.ts:48*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`behavior` | [AuthBehavior](../modules/_equinor_fusion_web_msal.md#authbehavior) | "popup" |
`options?` | [AuthRequest](../modules/_equinor_fusion_web_msal.md#authrequest) | - |

**Returns:** Promise\<AuthenticationResult \| void>

___

### login

▸ **login**(`behavior?`: [AuthBehavior](../modules/_equinor_fusion_web_msal.md#authbehavior), `options?`: [AuthRequest](../modules/_equinor_fusion_web_msal.md#authrequest)): Promise\<AuthenticationResult \| void>

*Defined in web/msal/src/module.ts:40*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`behavior` | [AuthBehavior](../modules/_equinor_fusion_web_msal.md#authbehavior) | "popup" |
`options?` | [AuthRequest](../modules/_equinor_fusion_web_msal.md#authrequest) | - |

**Returns:** Promise\<AuthenticationResult \| void>

___

### createInstance

▸ `Static`**createInstance**(`auth`: [AuthClientOptions](../modules/_equinor_fusion_web_msal.md#authclientoptions)): [AuthModule](_equinor_fusion_web_msal.authmodule.md)\<[AuthClient](../modules/_equinor_fusion_web_msal.md#authclient)>

*Defined in web/msal/src/module.ts:25*

Creates an Auth module with default config extended by provided options and default client.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`auth` | [AuthClientOptions](../modules/_equinor_fusion_web_msal.md#authclientoptions) |   |

**Returns:** [AuthModule](_equinor_fusion_web_msal.authmodule.md)\<[AuthClient](../modules/_equinor_fusion_web_msal.md#authclient)>
