**[Fusion Core](../README.md)**

> [Globals](../globals.md) / @equinor/fusion-web-api-resource

# Module: @equinor/fusion-web-api-resource

# `web-api-resource`

> TODO: description

## Usage

```
const webApiResource = require('web-api-resource');

```

## Index

### References

* [ApiResource](_equinor_fusion_web_api_resource.md#apiresource)
* [ApiResourceAuth](_equinor_fusion_web_api_resource.md#apiresourceauth)
* [ApiResourceCollection](_equinor_fusion_web_api_resource.md#apiresourcecollection)
* [ApiResourceRequest](_equinor_fusion_web_api_resource.md#apiresourcerequest)
* [RequestMethod](_equinor_fusion_web_api_resource.md#requestmethod)

### Classes

* [ApiResource](../classes/_equinor_fusion_web_api_resource.apiresource.md)
* [ApiResourceCollection](../classes/_equinor_fusion_web_api_resource.apiresourcecollection.md)

### Type aliases

* [ApiResourceAuth](_equinor_fusion_web_api_resource.md#apiresourceauth)
* [ApiResourceRequest](_equinor_fusion_web_api_resource.md#apiresourcerequest)
* [RequestMethod](_equinor_fusion_web_api_resource.md#requestmethod)
* [ResourceCtor](_equinor_fusion_web_api_resource.md#resourcector)

### Functions

* [matchRequestMethod](_equinor_fusion_web_api_resource.md#matchrequestmethod)

## References

### ApiResource

Re-exports: [ApiResource](../classes/_equinor_fusion_web_api_resource.apiresource.md)

___

### ApiResourceAuth

Re-exports: [ApiResourceAuth](_equinor_fusion_web_api_resource.md#apiresourceauth)

___

### ApiResourceCollection

Re-exports: [ApiResourceCollection](../classes/_equinor_fusion_web_api_resource.apiresourcecollection.md)

___

### ApiResourceRequest

Re-exports: [ApiResourceRequest](_equinor_fusion_web_api_resource.md#apiresourcerequest)

___

### RequestMethod

Re-exports: [RequestMethod](_equinor_fusion_web_api_resource.md#requestmethod)

## Type aliases

### ApiResourceAuth

Ƭ  **ApiResourceAuth**: { authority?: undefined \| string ; scopes?: string[]  }

*Defined in web/api-resource/src/resource.ts:5*

#### Type declaration:

Name | Type |
------ | ------ |
`authority?` | undefined \| string |
`scopes?` | string[] |

___

### ApiResourceRequest

Ƭ  **ApiResourceRequest**: { headers?: Record\<string, string> ; methods?: [RequestMethod](_equinor_fusion_web_api_resource.md#requestmethod)[]  }

*Defined in web/api-resource/src/resource.ts:10*

#### Type declaration:

Name | Type |
------ | ------ |
`headers?` | Record\<string, string> |
`methods?` | [RequestMethod](_equinor_fusion_web_api_resource.md#requestmethod)[] |

___

### RequestMethod

Ƭ  **RequestMethod**: \"GET\" \| \"POST\" \| \"PUT\" \| \"PATCH\" \| string

*Defined in web/api-resource/src/resource.ts:3*

___

### ResourceCtor

Ƭ  **ResourceCtor**\<T>: {}

*Defined in web/api-resource/src/collection.ts:3*

#### Type parameters:

Name |
------ |
`T` |

## Functions

### matchRequestMethod

▸ `Const`**matchRequestMethod**\<T>(`resources`: T[], `method`: string): undefined \| T

*Defined in web/api-resource/src/collection.ts:5*

#### Type parameters:

Name | Type | Default |
------ | ------ | ------ |
`T` | [ApiResource](../classes/_equinor_fusion_web_api_resource.apiresource.md) | ApiResource |

#### Parameters:

Name | Type |
------ | ------ |
`resources` | T[] |
`method` | string |

**Returns:** undefined \| T
