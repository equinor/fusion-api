import AuthApp from "./AuthApp";
import AuthToken from "./AuthToken";
import AuthUser, { AuthUserJSON } from "./AuthUser";

enum TokenCacheKey {
    TOKEN,
    EXPIRATION,
}

export default class AuthCache {
    private static createCacheKey(app: AuthApp, key: TokenCacheKey): string {
        return `FUSION_AUTH_CACHE:${app.clientId}:${key}`;
    }

    private static createUserCacheKey(): string {
        return "FUSION_AUTH_USER";
    }

    static storeToken(app: AuthApp, token: AuthToken): void {
        localStorage.setItem(AuthCache.createCacheKey(app, TokenCacheKey.TOKEN), token.toString());
    }

    static getToken(app: AuthApp): AuthToken | null {
        const originalToken = localStorage.getItem(
            AuthCache.createCacheKey(app, TokenCacheKey.TOKEN)
        );

        if (!originalToken) {
            return null;
        }

        return AuthToken.parse(originalToken);
    }

    static storeUser(user: AuthUser) {
        localStorage.setItem(AuthCache.createUserCacheKey(), user.toJSON());
    }

    static getUser(): AuthUser | null {
        const cachedUser = localStorage.getItem(AuthCache.createUserCacheKey());

        if (cachedUser === null) {
            return null;
        }

        const parsed = JSON.parse(cachedUser) as AuthUserJSON;
        return AuthUser.fromJSON(parsed);
    }
}
