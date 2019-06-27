import AuthApp from "./AuthApp";
import AuthToken from "./AuthToken";
import AuthNonce from "./AuthNonce";
import AuthCache from "./AuthCache";
import AuthUser from "./AuthUser";

export class FusionAuthAppNotFoundError extends Error {
    constructor(clientId: string) {
        super(`Unable to find app for client id [${clientId}]`);
    }
}

export class FusionAuthLoginError extends Error {}

export interface IAuthContainer {
    /**
     * Handle redirect back from login. Should not be called by apps or tiles
     */
    handleWindowCallbackAsync(): Promise<void>;

    /**
     * Acquire token for specified resource
     * @param resource Either clientId or a resource url used to resolve a registered app and token
     * @throws {FusionAuthAppNotFoundError} When unable to match specified resource to a registered app
     */
    acquireTokenAsync(resource: string): Promise<string | null>;

    /**
     * Register an AAD app for authentication.
     * Returns false if login is required. (use AuthContainer.login(clientId);)
     * @param clientId The AAD app client id
     * @param resources An array of resources that uses the specified client id
     */
    registerAppAsync(clientId: string, resources: string[]): Promise<boolean>;

    /**
     * Initiates the login process
     * @param clientId The AAD app client id
     * @throws {FusionAuthAppNotFoundError} When unable to match specified resource to a registered app
     */
    login(clientId: string): void;

    /**
     * Log out
     * @param clientId Optional client id to log out of. If blank it will log out of all apps
     */
    logoutAsync(clientId?: string): Promise<void>;

    /**
     * Get the current cached user
     */
    getCachedUserAsync(): Promise<AuthUser | null>;

    /**
     * Get the current cached user sync
     */
    getCachedUser(): AuthUser | null;
}

const getTopLevelWindow = (win: Window): Window => {
    if(win === win.parent) {
        return win;
    }

    return getTopLevelWindow(win.parent);
};

export default class AuthContainer implements IAuthContainer {
    private apps: AuthApp[];
    private cache: AuthCache;
    private cachedUser: AuthUser | null = null;

    constructor() {
        this.apps = [];
        this.cache = new AuthCache();
    }

    async handleWindowCallbackAsync(): Promise<void> {
        const token = AuthContainer.getTokenFromHash(window.location.hash);

        if (token === null) {
            return;
        }

        try {
            const parsedToken = AuthToken.parse(token);
            const nonce = AuthNonce.resolve(parsedToken.nonce);
            const clientId = nonce.toString();

            const app = new AuthApp(clientId, []);
            this.apps.push(app);

            await this.cache.storeTokenAsync(app, parsedToken);

            const cachedUser =
                (await this.getCachedUserAsync()) || AuthUser.createFromToken(parsedToken);
            cachedUser.mergeWithToken(parsedToken);
            await this.cacheUserAsync(cachedUser);
            window.location.hash = "";
        } catch (e) {
            throw new FusionAuthLoginError();
            // Log?
        }
    }

    async acquireTokenAsync(resource: string): Promise<string | null> {
        const app = this.resolveApp(resource);

        if (app === null) {
            throw new FusionAuthAppNotFoundError(resource);
        }

        return new Promise(async resolve => {
            const cachedToken = await this.cache.getTokenAsync(app);

            if (cachedToken !== null && cachedToken.isValid()) {
                return resolve(cachedToken.toString());
            }

            // TODO: This should refresh the token instead of logging in
            // For now this is not possible because of iframes and crazy stuff
            this.login(resource);

            return resolve(null);
        });
    }

    async registerAppAsync(clientId: string, resources: string[]): Promise<boolean> {
        const existingApp = this.resolveApp(clientId);

        if (existingApp !== null) {
            existingApp.updateResources(resources);
            return (await this.cache.getTokenAsync(existingApp)) !== null;
        }

        const newApp = new AuthApp(clientId, resources);
        this.apps.push(newApp);

        const cachedToken = await this.cache.getTokenAsync(newApp);

        if (cachedToken !== null) {
            return true;
        }

        return false;
    }

    login(clientId: string): void {
        const app = this.resolveApp(clientId);

        if (app === null) {
            throw new FusionAuthAppNotFoundError(clientId);
        }

        const nonce = AuthNonce.createNew(app);
        // Store redirect url

        // Login page cannot be displayed within a frame
        // Get the top level window and redirect there
        getTopLevelWindow(window).location.href = AuthContainer.buildLoginUrl(app, nonce);
    }

    async logoutAsync(clientId?: string) {
        if(clientId) {
            const app = this.resolveApp(clientId);

            if (app === null) {
                throw new FusionAuthAppNotFoundError(clientId);
            }
            
            return await this.cache.clearTokenAsync(app);
        }

        await this.cache.clearAsync();
        // TODO: Redirect to sign out page to clear cookies
    }

    async getCachedUserAsync(): Promise<AuthUser | null> {
        if (!this.cachedUser) {
            this.cachedUser = await this.cache.getUserAsync();
        }

        return this.cachedUser;
    }

    getCachedUser() {
        return this.cachedUser || null;
    }

    private async cacheUserAsync(user: AuthUser): Promise<void> {
        this.cachedUser = user;
        await this.cache.storeUserAsync(user);
    }

    private static getResourceOrigin(resource: string): string {
        try {
            const url = new URL(resource);
            return url.origin;
        } catch {
            return resource;
        }
    }

    private static getTokenFromHash(hash: string): string | null {
        const parts = hash.substr(1).split("&");
        const tokenPart = parts.find(part => part.indexOf("id_token=") === 0);

        if (typeof tokenPart === "undefined") {
            return null;
        }

        return tokenPart.replace("id_token=", "");
    }

    private static buildLoginUrl(app: AuthApp, nonce: AuthNonce, customParams: object = {}) {
        const base =
            "https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/authorize";
        const params: any = {
            ...customParams,
            client_id: app.clientId,
            response_type: "id_token",
            redirect_uri: getTopLevelWindow(window).location.href,
            // login_hint: window["currentUpn"], // Get current user profile mail
            domain_hint: "@equinor.com",
            nonce: nonce.getKey(),
        };

        const queryString = Object.keys(params).reduce(
            (query, key) => query + `${query ? "&" : ""}${key}=${encodeURIComponent(params[key])}`,
            ""
        );

        return base + "?" + queryString;
    }

    private resolveApp(resource: string): AuthApp | null {
        const resourceOrigin = AuthContainer.getResourceOrigin(resource);
        const app = this.apps.find(
            app => app.resources.indexOf(resourceOrigin) > 0 || app.clientId === resourceOrigin
        );

        if (typeof app === "undefined") {
            return null;
        }

        return app;
    }
}
