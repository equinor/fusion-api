**[Fusion Core](../README.md)**

> [Globals](../globals.md) / [@equinor/fusion-web-api-resource](../modules/_equinor_fusion_web_api_resource.md) / ApiResourceCollection

# Class: ApiResourceCollection\<T>

TODO: write example

## Type parameters

Name | Type | Default |
------ | ------ | ------ |
`T` | [ApiResource](_equinor_fusion_web_api_resource.apiresource.md) | ApiResource |

## Hierarchy

* **ApiResourceCollection**

## Index

### Constructors

* [constructor](_equinor_fusion_web_api_resource.apiresourcecollection.md#constructor)

### Properties

* [endpoint](_equinor_fusion_web_api_resource.apiresourcecollection.md#endpoint)

### Accessors

* [resources](_equinor_fusion_web_api_resource.apiresourcecollection.md#resources)

### Methods

* [addResource](_equinor_fusion_web_api_resource.apiresourcecollection.md#addresource)
* [get](_equinor_fusion_web_api_resource.apiresourcecollection.md#get)
* [match](_equinor_fusion_web_api_resource.apiresourcecollection.md#match)
* [set](_equinor_fusion_web_api_resource.apiresourcecollection.md#set)

## Constructors

### constructor

\+ **new ApiResourceCollection**(`endpoint`: string, `_resources?`: Record\<string, T>, `_resourceCtor?`: [ResourceCtor](../modules/_equinor_fusion_web_api_resource.md#resourcector)\<T>): [ApiResourceCollection](_equinor_fusion_web_api_resource.apiresourcecollection.md)

*Defined in web/api-resource/src/collection.ts:15*

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`endpoint` | string | - | base url of collection |
`_resources` | Record\<string, T> | {} | initial collection |
`_resourceCtor?` | [ResourceCtor](../modules/_equinor_fusion_web_api_resource.md#resourcector)\<T> | - | - |

**Returns:** [ApiResourceCollection](_equinor_fusion_web_api_resource.apiresourcecollection.md)

## Properties

### endpoint

• `Readonly` **endpoint**: string

*Defined in web/api-resource/src/collection.ts:23*

base url of collection

## Accessors

### resources

• get **resources**(): T[]

*Defined in web/api-resource/src/collection.ts:31*

Returns registered resources in collection

**Returns:** T[]

## Methods

### addResource

▸ **addResource**(`name`: string, `resource`: Pick\<T, \"path\" \| \"auth\" \| \"request\">): T

*Defined in web/api-resource/src/collection.ts:71*

Create a new resource, adds it to collection and returns the created resource

**`example`** 
```typescript
collection.addResource('my.service', {path: '/api/service/:id' });
collection.addResource('my.service.PUT', {
   path: '/api/service/:id',
   request: { methods: ['PUT', 'POST'] },
   auth: {scopes: ['user.write']}
});
```

**`remarks`** 
this method will replace existing resource with same provided name

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string | resource name |
`resource` | Pick\<T, \"path\" \| \"auth\" \| \"request\"> | - |

**Returns:** T

___

### get

▸ **get**(`name`: string): T

*Defined in web/api-resource/src/collection.ts:39*

Get a resource from collection by name

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** T

___

### match

▸ **match**(`url`: string, `method`: [RequestMethod](../modules/_equinor_fusion_web_api_resource.md#requestmethod)): T \| undefined

*Defined in web/api-resource/src/collection.ts:85*

Get resource by provided endpoint and request method.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`url` | string | endpoint to match resources against |
`method` | [RequestMethod](../modules/_equinor_fusion_web_api_resource.md#requestmethod) | request method to match, falls back to resource where methods are undefined  |

**Returns:** T \| undefined

___

### set

▸ **set**(`name`: string, `resource`: T): void

*Defined in web/api-resource/src/collection.ts:48*

Adds or replace a resource to the collection

#### Parameters:

Name | Type |
------ | ------ |
`name` | string |
`resource` | T |

**Returns:** void
