import AuthApp from './AuthApp';
import AuthToken from './AuthToken';
import AuthUser, { AuthUserJSON } from './AuthUser';
import ReliableDictionary, { LocalStorageProvider } from '../utils/ReliableDictionary';
import EventHub from '../utils/EventHub';

enum TokenCacheKey {
    TOKEN = "TOKEN",
    USER = "USER",
    REDIRECT_URL = "REDIRECT_URL",
    LOGIN_LOCK_STATUS = "LOGIN_LOCK_STATUS",
};

export default class AuthCache extends ReliableDictionary {
    constructor() {
        super(new LocalStorageProvider('FUSION_AUTH_CACHE', new EventHub()));
    }

    private static createAppCacheKey(app: AuthApp, key: TokenCacheKey) {
        return `FUSION_AUTH_CACHE:${app.clientId}:${key}`;
    }

    async storeTokenAsync(app: AuthApp, token: AuthToken) {
        await this.setAsync(
            AuthCache.createAppCacheKey(app, TokenCacheKey.TOKEN),
            token.toString()
        );
    }

    async getTokenAsync(app: AuthApp) {
        const originalToken = await this.getAsync<string, string>(
            AuthCache.createAppCacheKey(app, TokenCacheKey.TOKEN)
        );

        if (!originalToken) {
            return null;
        }

        return AuthToken.parse(originalToken);
    }

    async clearTokenAsync(app: AuthApp) {
        await this.removeAsync(AuthCache.createAppCacheKey(app, TokenCacheKey.TOKEN));
    }

    async storeUserAsync(user: AuthUser) {
        await this.setAsync(TokenCacheKey.USER, user.toObject());
    }

    async getUserAsync() {
        const cachedUser = await this.getAsync<string, AuthUserJSON>(TokenCacheKey.USER);

        if (cachedUser === null) {
            return null;
        }

        return AuthUser.fromJSON(cachedUser);
    }

    async storeRedirectUrl(redirectUrl: string) {
        await this.setAsync(TokenCacheKey.REDIRECT_URL, redirectUrl);
    }

    async getRedirectUrl() {
        const redirectUrl = await this.getAsync<string, string>(TokenCacheKey.REDIRECT_URL);
        await this.removeAsync(TokenCacheKey.REDIRECT_URL);
        return redirectUrl;
    }

    async setLoginLock() {
        await this.setAsync(TokenCacheKey.LOGIN_LOCK_STATUS, "locked");
    }

    async releaseLoginLock() {
        await this.setAsync(TokenCacheKey.LOGIN_LOCK_STATUS, "open");
    }

    async isLoginLocked() {
        const lockStatus = await this.getAsync<string, string>(TokenCacheKey.LOGIN_LOCK_STATUS);
        return lockStatus === "locked";
    }
}
