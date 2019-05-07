import AuthApp from "./AuthApp";
import AuthToken from "./AuthToken";
import AuthNonce from "./AuthNonce";
import AuthTokenCache from "./AuthTokenCache";

class FusionAuthAppNotFoundError extends Error {
    constructor(clientId: string) {
        super(`Unable to find app for client id [${clientId}]`);
    }
}

export interface IAuthContainer {
    /**
     * Handle redirect back from login. Should not be called by apps or tiles
     */
    handleWindowCallback(): void;

    /**
     * Acquire token for specified resource
     * @param resource Either clientId or a resource url used to resolve a registered app and token
     * @throws {FusionAuthAppNotFoundError} When unable to match specified resource to a registered app
     * @todo Make async
     */
    acquireToken(resource: string): string | null;

    /**
     * Register an AAD app for authentication.
     * Returns false if login is required. (use AuthContainer.login(clientId);)
     * @param clientId The AAD app client id
     * @param resources An array of resources that uses the specified client id
     */
    registerApp(clientId: string, resources: string[]): boolean;

    /**
     * Initiates the login process
     * @param clientId The AAD app client id
     * @throws {FusionAuthAppNotFoundError} When unable to match specified resource to a registered app
     */
    login(clientId: string): void;
}

export default class AuthContainer implements IAuthContainer {
    private apps: AuthApp[];

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
            redirect_uri: window.location.origin,
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

    constructor() {
        this.apps = [];
    }

    private resolveApp(resource: string): AuthApp | null {
        const resourceOrigin = AuthContainer.getResourceOrigin(resource);
        const app = this.apps.find(
            app => app.resources.indexOf(resourceOrigin) > 0 || app.clientId === resourceOrigin
        );

        if(typeof app === "undefined") {
            return null;
        }

        return app;
    }

    handleWindowCallback(): void {
        const token = AuthContainer.getTokenFromHash(window.location.hash);

        if(token === null) {
            return;
        }

        try {
            const parsedToken = AuthToken.parse(token);
            const nonce = AuthNonce.resolve(parsedToken.nonce);
            const clientId = nonce.toString();

            const app = new AuthApp(clientId, []);
            this.apps.push(app);

            AuthTokenCache.storeToken(app, parsedToken);
        } catch(e) {
            // Log?
        }
    }

    acquireToken(resource: string): string | null {
        const app = this.resolveApp(resource);

        if(app === null) {
            throw new FusionAuthAppNotFoundError(resource);
        }

        const cachedToken = AuthTokenCache.getToken(app);

        if(cachedToken !== null && cachedToken.isValid()) {
            return cachedToken.toString();
        }

        // TODO: This should refresh the token instead of logging in
        // For now this is not possible because of iframes and crazy stuff
        this.login(resource);

        return null;
    }

    registerApp(clientId: string, resources: string[]): boolean {
        const existingApp = this.resolveApp(clientId);

        if(existingApp !== null) {
            existingApp.updateResources(resources);
            return AuthTokenCache.getToken(existingApp) !== null;
        }

        const newApp = new AuthApp(clientId, resources);
        this.apps.push(newApp);

        const cachedToken = AuthTokenCache.getToken(newApp);

        if(cachedToken !== null) {
            return true;
        }

        return false;
    }

    login(clientId: string): void {
        const app = this.resolveApp(clientId);

        if(app === null) {
            throw new FusionAuthAppNotFoundError(clientId);
        }

        const nonce = AuthNonce.createNew(app);
        // Store redirect url
        window.location.href = AuthContainer.buildLoginUrl(app, nonce);
    }
}