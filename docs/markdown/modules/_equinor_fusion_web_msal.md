**[Fusion Core](../README.md)**

> [Globals](../globals.md) / @equinor/fusion-web-msal

# Module: @equinor/fusion-web-msal

# `@equinor/fusion-web-msal`

> Light wrapper of Microsoft official [msal library](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser)

## Behavior

By default the client will try to uses a hidden iframe to fetch an authorization code from the eSTS.

There are cases where this may not work:

- Any browser using a form of Intelligent Tracking Prevention
- If there is not an established session with the service
- For the cases where interaction is required, you cannot send a request with `prompt=none`

**Popup**

Use when initiating the login process via opening a popup window in the user's browser

**Redirect**

This function redirects the page, so any code that follows this function will not execute.

_IMPORTANT:_ It is NOT recommended to have code that is dependent on the resolution of the Promise. This function will navigate away from the current browser window. It currently returns a Promise in order to reflect the asynchronous nature of the code running in this function.

## Usage

### Basic

```typescript
import { AuthModule } from '@equinor/fusion-web-msal';

const doWork = async () => {
  const auth = AuthModule.createInstance({
    clientId: 'azure-tennant-id',
    scopes: ['openid'],
  });

  await auth.login();

  const token = await auth.acquireToken({
    scopes: ['email'],
  });

  if (!token) throw Error('failed to fetch token');

  fetch('https://my-server.not/api/bogus', {
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  });
};
```

### Popup

```typescript
auth.login('popup');
auth.acquireToken('popup');
```

### Redirect

```typescript
auth.login('redirect');
auth.acquireToken('redirect');
```

## Index

### References

* [AuthBehavior](_equinor_fusion_web_msal.md#authbehavior)
* [AuthClient](_equinor_fusion_web_msal.md#authclient)
* [AuthClientOptions](_equinor_fusion_web_msal.md#authclientoptions)
* [AuthModule](_equinor_fusion_web_msal.md#authmodule)
* [createClient](_equinor_fusion_web_msal.md#createclient)
* [createConfig](_equinor_fusion_web_msal.md#createconfig)

### Classes

* [AuthModule](../classes/_equinor_fusion_web_msal.authmodule.md)

### Interfaces

* [Account](../interfaces/_equinor_fusion_web_msal.account.md)
* [AcquireToken](../interfaces/_equinor_fusion_web_msal.acquiretoken.md)
* [Login](../interfaces/_equinor_fusion_web_msal.login.md)

### Type aliases

* [AuthBehavior](_equinor_fusion_web_msal.md#authbehavior)
* [AuthClient](_equinor_fusion_web_msal.md#authclient)
* [AuthClient](_equinor_fusion_web_msal.md#authclient)
* [AuthClientOptions](_equinor_fusion_web_msal.md#authclientoptions)
* [AuthRequest](_equinor_fusion_web_msal.md#authrequest)
* [LoginClient](_equinor_fusion_web_msal.md#loginclient)
* [Request](_equinor_fusion_web_msal.md#request)
* [Request](_equinor_fusion_web_msal.md#request)
* [TokenClient](_equinor_fusion_web_msal.md#tokenclient)

### Functions

* [account](_equinor_fusion_web_msal.md#account)
* [acquireToken](_equinor_fusion_web_msal.md#acquiretoken)
* [createClient](_equinor_fusion_web_msal.md#createclient)
* [createConfig](_equinor_fusion_web_msal.md#createconfig)
* [login](_equinor_fusion_web_msal.md#login)

## References

### AuthBehavior

Re-exports: [AuthBehavior](_equinor_fusion_web_msal.md#authbehavior)

___

### AuthClient

Re-exports: [AuthClient](_equinor_fusion_web_msal.md#authclient)

___

### AuthClientOptions

Re-exports: [AuthClientOptions](_equinor_fusion_web_msal.md#authclientoptions)

___

### AuthModule

Re-exports: [AuthModule](../classes/_equinor_fusion_web_msal.authmodule.md)

___

### createClient

Re-exports: [createClient](_equinor_fusion_web_msal.md#createclient)

___

### createConfig

Re-exports: [createConfig](_equinor_fusion_web_msal.md#createconfig)

## Type aliases

### AuthBehavior

Ƭ  **AuthBehavior**: \"popup\" \| \"redirect\"

*Defined in web/msal/src/module.ts:9*

___

### AuthClient

Ƭ  **AuthClient**: Pick\<PublicClientApplication, \"getAllAccounts\">

*Defined in web/msal/src/account.ts:3*

___

### AuthClient

Ƭ  **AuthClient**\<T>: { account: [Account](../interfaces/_equinor_fusion_web_msal.account.md) ; acquireToken: [AcquireToken](../interfaces/_equinor_fusion_web_msal.acquiretoken.md) ; client: T ; login: [Login](../interfaces/_equinor_fusion_web_msal.login.md)  }

*Defined in web/msal/src/client.ts:6*

#### Type parameters:

Name | Default |
------ | ------ |
`T` | unknown |

#### Type declaration:

Name | Type |
------ | ------ |
`account` | [Account](../interfaces/_equinor_fusion_web_msal.account.md) |
`acquireToken` | [AcquireToken](../interfaces/_equinor_fusion_web_msal.acquiretoken.md) |
`client` | T |
`login` | [Login](../interfaces/_equinor_fusion_web_msal.login.md) |

___

### AuthClientOptions

Ƭ  **AuthClientOptions**: Configuration[\"auth\"]

*Defined in web/msal/src/client.ts:13*

___

### AuthRequest

Ƭ  **AuthRequest**: PopupRequest \| RedirectRequest

*Defined in web/msal/src/module.ts:7*

___

### LoginClient

Ƭ  **LoginClient**: Pick\<PublicClientApplication, \"ssoSilent\" \| \"loginPopup\" \| \"loginRedirect\">

*Defined in web/msal/src/login.ts:12*

___

### Request

Ƭ  **Request**: SsoSilentRequest \| PopupRequest \| RedirectRequest

*Defined in web/msal/src/login.ts:10*

___

### Request

Ƭ  **Request**: SilentRequest \| PopupRequest \| RedirectRequest

*Defined in web/msal/src/token.ts:11*

___

### TokenClient

Ƭ  **TokenClient**: Pick\<PublicClientApplication, \"acquireTokenSilent\" \| \"acquireTokenPopup\" \| \"acquireTokenRedirect\">

*Defined in web/msal/src/token.ts:13*

## Functions

### account

▸ `Const`**account**\<T>(`client`: T): [Account](../interfaces/_equinor_fusion_web_msal.account.md)

*Defined in web/msal/src/account.ts:9*

#### Type parameters:

Name | Type | Default |
------ | ------ | ------ |
`T` | [AuthClient](_equinor_fusion_web_msal.md#authclient) | PublicClientApplication |

#### Parameters:

Name | Type |
------ | ------ |
`client` | T |

**Returns:** [Account](../interfaces/_equinor_fusion_web_msal.account.md)

___

### acquireToken

▸ `Const`**acquireToken**\<T>(`client`: T): [AcquireToken](../interfaces/_equinor_fusion_web_msal.acquiretoken.md)

*Defined in web/msal/src/token.ts:19*

#### Type parameters:

Name | Type | Default |
------ | ------ | ------ |
`T` | [TokenClient](_equinor_fusion_web_msal.md#tokenclient) | PublicClientApplication |

#### Parameters:

Name | Type |
------ | ------ |
`client` | T |

**Returns:** [AcquireToken](../interfaces/_equinor_fusion_web_msal.acquiretoken.md)

___

### createClient

▸ `Const`**createClient**(`config`: Configuration): [AuthClient](_equinor_fusion_web_msal.md#authclient)

*Defined in web/msal/src/client.ts:21*

#### Parameters:

Name | Type |
------ | ------ |
`config` | Configuration |

**Returns:** [AuthClient](_equinor_fusion_web_msal.md#authclient)

___

### createConfig

▸ `Const`**createConfig**(`auth`: [AuthClientOptions](_equinor_fusion_web_msal.md#authclientoptions)): Configuration

*Defined in web/msal/src/client.ts:14*

#### Parameters:

Name | Type |
------ | ------ |
`auth` | [AuthClientOptions](_equinor_fusion_web_msal.md#authclientoptions) |

**Returns:** Configuration

___

### login

▸ `Const`**login**\<T>(`client`: T): [Login](../interfaces/_equinor_fusion_web_msal.login.md)

*Defined in web/msal/src/login.ts:18*

#### Type parameters:

Name | Type | Default |
------ | ------ | ------ |
`T` | [LoginClient](_equinor_fusion_web_msal.md#loginclient) | PublicClientApplication |

#### Parameters:

Name | Type |
------ | ------ |
`client` | T |

**Returns:** [Login](../interfaces/_equinor_fusion_web_msal.login.md)
