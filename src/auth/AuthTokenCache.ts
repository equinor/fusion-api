import AuthApp from "./AuthApp";
import AuthToken from "./AuthToken";

enum TokenCacheKey {
    TOKEN,
    EXPIRATION,
}

export default class AuthTokenCache {
    private static createCacheKey(app: AuthApp, key: TokenCacheKey): string {
        return `FUSION_AUTH_CACHE:${app.clientId}:${key}`;
    }

    static storeToken(app: AuthApp, token: AuthToken): void {
        localStorage.setItem(
            AuthTokenCache.createCacheKey(app, TokenCacheKey.TOKEN),
            token.toString()
        );
    }

    static getToken(app: AuthApp): AuthToken | null {
        const originalToken = localStorage.getItem(
            AuthTokenCache.createCacheKey(app, TokenCacheKey.TOKEN)
        );

        if (!originalToken) {
            return null;
        }

        return AuthToken.parse(originalToken);
    }
}
