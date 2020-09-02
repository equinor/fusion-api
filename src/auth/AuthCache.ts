import AuthApp from './AuthApp';
import AuthToken from './AuthToken';
import AuthUser, { AuthUserJSON } from './AuthUser';
import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';
import EventHub from '../utils/EventHub';

enum CacheKey {
    TOKEN = "TOKEN",
    USER = "USER",
    REDIRECT_URL = "REDIRECT_URL",
    APP_LOGIN_LOCK = "APP_LOGIN_LOCK",
};

export default class AuthCache extends ReliableDictionary {
    constructor() {
        super(new LocalStorageProvider('FUSION_AUTH_CACHE', new EventHub()));
    }

    private static createAppCacheKey(app: AuthApp, key: CacheKey) {
        return `FUSION_AUTH_CACHE:${app.clientId}:${key}`;
    }

    async storeTokenAsync(app: AuthApp, token: AuthToken) {
        await this.setAsync(
            AuthCache.createAppCacheKey(app, CacheKey.TOKEN),
            token.toString()
        );
    }

    async getTokenAsync(app: AuthApp) {
        const originalToken = await this.getAsync<string, string>(
            AuthCache.createAppCacheKey(app, CacheKey.TOKEN)
        );

        if (!originalToken) {
            return null;
        }

        return AuthToken.parse(originalToken);
    }

    async clearTokenAsync(app: AuthApp) {
        await this.removeAsync(AuthCache.createAppCacheKey(app, CacheKey.TOKEN));
    }

    async storeUserAsync(user: AuthUser) {
        await this.setAsync(CacheKey.USER, user.toObject());
    }

    async getUserAsync() {
        const cachedUser = await this.getAsync<string, AuthUserJSON>(CacheKey.USER);

        if (cachedUser === null) {
            return null;
        }

        return AuthUser.fromJSON(cachedUser);
    }

    async storeRedirectUrl(redirectUrl: string) {
        await this.setAsync(CacheKey.REDIRECT_URL, redirectUrl);
    }

    async getRedirectUrl() {
        const redirectUrl = await this.getAsync<string, string>(CacheKey.REDIRECT_URL);
        await this.removeAsync(CacheKey.REDIRECT_URL);
        return redirectUrl;
    }

    async setAppLoginLock(clientId: string) {
        const payload = {
            clientId,
            created: Date.now()
        };
        await this.setAsync(CacheKey.APP_LOGIN_LOCK, JSON.stringify(payload));
    }

    /**
     * Clears app lock from auth cache
     * 
     * @TODO remove parameter since never been used
     * 
     * @param _clientId [string] @deprecated
     */
    async clearAppLoginLock(_clientId?: string) {
        return this.removeAsync(CacheKey.APP_LOGIN_LOCK);
    }

    async getAppLoginLock(): Promise<{ clientId?: string; created?: string; }> {
        const payload = await this.getAsync<string, string>(CacheKey.APP_LOGIN_LOCK);
        return (!!payload ? JSON.parse(payload) : {});
    }

    /**
     *  Check if an app has set a lock for authentication.
     *  If lock exceeds the provided lifetime, lock is removed
     * 
     * @param lifetime [number] max lifetime of a lock in seconds
     */
    async isAppLoginLocked(lifetime: number = 300) {
        try {
            const { created, clientId } = await this.getAppLoginLock();
            const isLocked = (Date.now() - Number(created || 0)) < (lifetime * 1000);
            const clearLock = !!clientId && !isLocked;
            clearLock && await this.clearAppLoginLock();
            return isLocked;
        } catch { // invalid lock data, most likely legacy
            await this.clearAppLoginLock();
        }
        return false;
    }
}
