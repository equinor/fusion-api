import AuthApp from "./AuthApp";
import AuthToken from "./AuthToken";
import AuthUser, { AuthUserJSON } from "./AuthUser";
import ReliableDirctionary, { LocalStorageProvider } from "../utils/ReliableDictionary";

enum TokenCacheKey {
    TOKEN = "TOKEN",
    USER = "USER"
}

export default class AuthCache extends ReliableDirctionary {
    constructor() {
        super(new LocalStorageProvider("FUSION_AUTH_CACHE"));
    }

    private static createAppCacheKey(app: AuthApp, key: TokenCacheKey): string {
        return `FUSION_AUTH_CACHE:${app.clientId}:${key}`;
    }

    async storeTokenAsync(app: AuthApp, token: AuthToken): Promise<void> {
        await this.setAsync(
            AuthCache.createAppCacheKey(app, TokenCacheKey.TOKEN),
            token.toString()
        );
    }

    async getTokenAsync(app: AuthApp): Promise<AuthToken | null> {
        const originalToken = await this.getAsync<string>(
            AuthCache.createAppCacheKey(app, TokenCacheKey.TOKEN)
        );

        if (!originalToken) {
            return null;
        }

        return AuthToken.parse(originalToken);
    }

    async storeUserAsync(user: AuthUser) {
        await this.setAsync(TokenCacheKey.USER, user.toObject());
    }

    async getUserAsync(): Promise<AuthUser | null> {
        const cachedUser = await this.getAsync<AuthUserJSON>(TokenCacheKey.USER);

        if (cachedUser === null) {
            return null;
        }

        return AuthUser.fromJSON(cachedUser);
    }
}
