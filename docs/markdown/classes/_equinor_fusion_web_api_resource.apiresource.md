**[Fusion Core](../README.md)**

> [Globals](../globals.md) / [@equinor/fusion-web-api-resource](../modules/_equinor_fusion_web_api_resource.md) / ApiResource

# Class: ApiResource\<T>

TODO: write

**`example`** 
```
const resource = new Resource('/api/:service/:id', {request: {headers: {'Content-Type': 'application/json'}}});
const url = resource.url('https://nowhere.now', { service: 'test', id: '99' });
const data = await fetch(url, {headers: resource.headers});
```

## Type parameters

Name | Default |
------ | ------ |
`T` | unknown |

## Hierarchy

* **ApiResource**

## Index

### Constructors

* [constructor](_equinor_fusion_web_api_resource.apiresource.md#constructor)

### Properties

* [auth](_equinor_fusion_web_api_resource.apiresource.md#auth)
* [path](_equinor_fusion_web_api_resource.apiresource.md#path)
* [request](_equinor_fusion_web_api_resource.apiresource.md#request)

### Accessors

* [headers](_equinor_fusion_web_api_resource.apiresource.md#headers)
* [pattern](_equinor_fusion_web_api_resource.apiresource.md#pattern)

### Methods

* [match](_equinor_fusion_web_api_resource.apiresource.md#match)
* [stringify](_equinor_fusion_web_api_resource.apiresource.md#stringify)
* [url](_equinor_fusion_web_api_resource.apiresource.md#url)

## Constructors

### constructor

\+ **new ApiResource**(`path`: string, `auth?`: [ApiResourceAuth](../modules/_equinor_fusion_web_api_resource.md#apiresourceauth), `request?`: [ApiResourceRequest](../modules/_equinor_fusion_web_api_resource.md#apiresourcerequest)): [ApiResource](_equinor_fusion_web_api_resource.apiresource.md)

*Defined in web/api-resource/src/resource.ts:24*

#### Parameters:

Name | Type |
------ | ------ |
`path` | string |
`auth?` | [ApiResourceAuth](../modules/_equinor_fusion_web_api_resource.md#apiresourceauth) |
`request?` | [ApiResourceRequest](../modules/_equinor_fusion_web_api_resource.md#apiresourcerequest) |

**Returns:** [ApiResource](_equinor_fusion_web_api_resource.apiresource.md)

## Properties

### auth

• `Optional` `Readonly` **auth**: [ApiResourceAuth](../modules/_equinor_fusion_web_api_resource.md#apiresourceauth)

*Defined in web/api-resource/src/resource.ts:25*

___

### path

• `Readonly` **path**: string

*Defined in web/api-resource/src/resource.ts:25*

___

### request

• `Optional` `Readonly` **request**: [ApiResourceRequest](../modules/_equinor_fusion_web_api_resource.md#apiresourcerequest)

*Defined in web/api-resource/src/resource.ts:25*

## Accessors

### headers

• get **headers**(): ApiResourceRequest[\"headers\"]

*Defined in web/api-resource/src/resource.ts:37*

**Returns:** ApiResourceRequest[\"headers\"]

request headers

___

### pattern

• get **pattern**(): UrlPattern

*Defined in web/api-resource/src/resource.ts:30*

**Returns:** UrlPattern

[url-pattern](https://www.npmjs.com/package/url-pattern)

## Methods

### match

▸ **match**(`path`: string): T

*Defined in web/api-resource/src/resource.ts:45*

Matches resource path with provided path

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`path` | string | path to test  |

**Returns:** T

___

### stringify

▸ **stringify**(`obj?`: T): string

*Defined in web/api-resource/src/resource.ts:53*

Stringifies path with provided object

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`obj?` | T | object to stringify  |

**Returns:** string

___

### url

▸ **url**(`endpoint`: string, `obj?`: T): string

*Defined in web/api-resource/src/resource.ts:62*

Creates an url from provided object

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`endpoint` | string | base url |
`obj?` | T | object to stringify  |

**Returns:** string
