import { HttpResponse } from '../HttpClient';
import EventEmitter from '../../utils/EventEmitter';
import { IDistributedState } from '../../utils/DistributedState';
import { IEventHub } from '../../utils/EventHub';
import DistributedState from '../../utils/DistributedState';

type CacheStatus = {
    age: Date | null;
    source: string | null;
    duration: number | null;
};

type CachedResource<T> = {
    resource: string;
    data: T | null;
    isFetching: boolean;
    cacheStatus: CacheStatus;
};

export type ReadonlyCachedResource<T> = Readonly<CachedResource<T>> & {
    data: Readonly<T> | null;
};

type ResourceCacheEvents = {
    update: <T>(changedResource: ReadonlyCachedResource<T>) => void;
};

type CachedResources = {
    [key: string]: CachedResource<any>;
};

export interface IResourceCache {
    setIsFetchingAsync<T>(resource: string): Promise<void>;
    updateAsync<T>(resource: string, response: HttpResponse<T>): Promise<void>;
    getAsync<T>(resource: string): Promise<ReadonlyCachedResource<T>>;
}

export default class ResourceCache extends EventEmitter<ResourceCacheEvents>
    implements IResourceCache {
    private cachedResources: IDistributedState<CachedResources>;

    constructor(eventHub: IEventHub) {
        super();
        this.cachedResources = new DistributedState<CachedResources>(
            'ResourceCache.CachedResources',
            {},
            eventHub
        );

        this.cachedResources.on('change', (cachedResources: CachedResources) => {
            this.emit('update', cachedResources);
        });
    }

    async setIsFetchingAsync<T>(resource: string): Promise<void> {
        const cachedResource = await this.getAsync<T>(resource);
        await this.setResourceAsync(resource, { ...cachedResource, isFetching: true });
    }

    async updateAsync<T>(resource: string, response: HttpResponse<T>): Promise<void> {
        const cachedResource = await this.getAsync<T>(resource);

        const cacheAgeHeader = response.headers.get('x-pp-cache-age');
        const age = cacheAgeHeader !== null ? new Date(cacheAgeHeader) : null;

        const cacheDurationHeader = response.headers.get('x-pp-cache-duration-minutes');
        const duration = cacheDurationHeader !== null ? parseInt(cacheDurationHeader, 10) : -1;
        const source = response.headers.get('x-pp-cache-source');

        const updatedResource = {
            ...cachedResource,
            data: response.data,
            isFetching: false,
            cacheStatus: {
                ...cachedResource.cacheStatus,
                age,
                duration,
                source,
            },
        };

        await this.setResourceAsync(resource, updatedResource);
    }

    async getAsync<T>(resource: string): Promise<ReadonlyCachedResource<T>> {
        if (typeof this.cachedResources.state[resource] === 'undefined') {
            await this.setResourceAsync(resource, {
                resource,
                data: null,
                isFetching: false,
                cacheStatus: {
                    age: null,
                    duration: null,
                    source: null,
                },
            });
        }

        return this.cachedResources.state[resource] as ReadonlyCachedResource<T>;
    }

    private async setResourceAsync<T>(
        resource: string,
        updatedResource: CachedResource<T>
    ): Promise<void> {
        this.cachedResources.state[resource] = updatedResource;
        this.emit('update', updatedResource);
    }
}
