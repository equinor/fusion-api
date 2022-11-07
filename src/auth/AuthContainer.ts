import AuthApp from './AuthApp';
import AuthToken from './AuthToken';
import AuthNonce from './AuthNonce';
import AuthCache from './AuthCache';
import AuthUser from './AuthUser';
import { trimTrailingSlash } from '../utils/url';
import { TelemetryLogger } from '../utils/telemetry';

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
    registerAppAsync(clientId: string, resources: string[], legacy?: boolean): Promise<boolean>;

    /**
     * Initiates the login process
     * @param clientId The AAD app client id
     * @throws {FusionAuthAppNotFoundError} When unable to match specified resource to a registered app
     */
    loginAsync(clientId: string): Promise<void>;

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

    /**
     * Set the telemetry logger
     * @param telemetryLogger
     */
    setTelemetryLogger(telemetryLogger: TelemetryLogger): void;
}

const getTopLevelWindow = (win: Window): Window => {
    if (win === win.parent) {
        return win;
    }

    return getTopLevelWindow(win.parent);
};

export default class AuthContainer implements IAuthContainer {
    protected apps: AuthApp[];
    protected cache: AuthCache;
    protected cachedUser: AuthUser | null = null;
    protected telemetryLogger?: TelemetryLogger;

    private _tokenQueue: Record<string, Promise<string | null>> = {};

    constructor() {
        this.apps = [];
        this.cache = new AuthCache();
    }

    async handleWindowCallbackAsync(): Promise<void> {
        const token = AuthContainer.getTokenFromHash(window.location.hash);
        const error = AuthContainer.getErrorFromHash(window.location.hash);

        if (error) {
            const authError = new FusionAuthLoginError(error);
            this.logError(authError as Error);
            throw authError;
        }

        if (token === null) {
            return;
        }

        try {
            const parsedToken = AuthToken.parse(token);
            const nonce = AuthNonce.resolve(parsedToken.nonce);
            const clientId = nonce.toString();

            const app = new AuthApp(clientId, []);
            this.apps.push(app);

            await this.updateTokenForAppAsync(app, token);
            window.location.hash = '';

            const redirectUrl = await this.cache.getRedirectUrl();
            if (
                redirectUrl &&
                AuthContainer.getResourceOrigin(redirectUrl) === window.location.origin
            ) {
                window.history.replaceState(null, '', redirectUrl);
                window.location.reload();
            }
        } catch (e) {
            this.logError(e as Error);
            throw new FusionAuthLoginError();
        }
    }

    private async _acquireTokenAsync(app: AuthApp, resource: string): Promise<string | null> {
        try {
            // try to use previous token (if any and not expired)
            const cachedToken = await this.cache.getTokenAsync(app);
            if (cachedToken !== null && cachedToken.isValid()) {
                return cachedToken.toString();
            }

            // clear previous token for app
            await this.cache.clearTokenAsync(app);

            const refreshedToken = await this.refreshTokenAsync(resource);
            if (!refreshedToken) {
                throw Error('invalid token');
            }

            // add new token to cache for app
            await this.updateTokenForAppAsync(app, refreshedToken);

            return refreshedToken;
        } catch (err) {
            console.log(err);
            // failed to acquire new token
            return null;
        } finally {
            // remove request from queue
            delete this._tokenQueue[app.clientId];
        }
    }

    acquireTokenAsync(resource: string): Promise<string | null> {
        const app = this.resolveApp(resource);
        if (app === null) {
            throw new FusionAuthAppNotFoundError(resource);
        }

        /**
         * since acquiring token is async we need to make sure that only
         * one thread is clearing old token and acquires a new one
         */
        if (!this._tokenQueue[app.clientId]) {
            this._tokenQueue[app.clientId] = this._acquireTokenAsync(app, resource);
        }

        return this._tokenQueue[app.clientId];
    }

    protected async refreshTokenAsync(resource: string): Promise<string | null> {
        // TODO: This should refresh the token instead of logging in
        // For now this is not possible because of iframes and crazy stuff
        await this.loginAsync(resource);
        return null;
    }

    async registerAppAsync(
        clientId: string,
        resources: string[],
        _legacy: boolean = true
    ): Promise<boolean> {
        resources = resources.filter(Boolean);
        const existingApp = this.resolveApp(clientId);

        if (existingApp !== null) {
            existingApp.updateResources(resources);
            const cachedToken = await this.cache.getTokenAsync(existingApp);
            if (cachedToken === null) {
                return false;
            }
            await this.cache.clearAppLoginLock(existingApp.clientId);
            return true;
        }

        const newApp = new AuthApp(clientId, resources);
        this.apps.push(newApp);

        const cachedToken = await this.cache.getTokenAsync(newApp);

        if (cachedToken !== null) {
            await this.cache.clearAppLoginLock(newApp.clientId);
            return true;
        }

        return false;
    }

    async loginAsync(clientId: string): Promise<void> {
        const app = this.resolveApp(clientId);
        if (app === null) {
            throw new FusionAuthAppNotFoundError(clientId);
        }

        const isLocked = await this.cache.isAppLoginLocked();
        if (isLocked) {
            return;
        }
        await this.cache.setAppLoginLock(app.clientId);
        const nonce = AuthNonce.createNew(app);
        this.cache.storeRedirectUrl(getTopLevelWindow(window).location.href);

        // Login page cannot be displayed within a frame
        // Get the top level window and redirect there
        getTopLevelWindow(window).location.href = await this.buildLoginUrlAsync(app, nonce);
    }

    async logoutAsync(clientId?: string) {
        if (clientId) {
            const app = this.resolveApp(clientId);

            if (app === null) {
                throw new FusionAuthAppNotFoundError(clientId);
            }

            return await this.cache.clearTokenAsync(app);
        }

        await this.cache.clearAsync();
        // TODO: Redirect to sign out page to clear cookies?
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

    setTelemetryLogger(telemetryLogger: TelemetryLogger) {
        this.telemetryLogger = telemetryLogger;
    }

    protected logError(error: Error) {
        if (this.telemetryLogger) {
            this.telemetryLogger.trackException({ error });
        }
    }

    protected async updateTokenForAppAsync(app: AuthApp, token: string) {
        const parsedToken = AuthToken.parse(token);
        await this.cache.storeTokenAsync(app, parsedToken);

        const cachedUser =
            (await this.getCachedUserAsync()) || AuthUser.createFromToken(parsedToken);

        cachedUser.mergeWithToken(parsedToken);
        await this.cacheUserAsync(cachedUser);
    }

    protected async cacheUserAsync(user: AuthUser): Promise<void> {
        this.cachedUser = user;
        await this.cache.storeUserAsync(user);
    }

    protected static getResourceOrigin(resource: string): string {
        try {
            const url = new URL(resource);
            return trimTrailingSlash(url.origin.toLowerCase());
        } catch {
            return '';
        }
    }

    protected static getTokenFromHash(hash: string): string | null {
        return AuthContainer.getPartFromHash(hash, 'id_token');
    }

    protected static getErrorFromHash(hash: string): string | null {
        return AuthContainer.getPartFromHash(hash, 'error');
    }

    protected static getPartFromHash(hash: string, key: string): string | null {
        const parts = hash.substr(1).split('&');
        const tokenPart = parts.find((part) => part.indexOf(`${key}=`) === 0);

        if (typeof tokenPart === 'undefined') {
            return null;
        }

        return tokenPart.replace(`${key}=`, '');
    }

    protected async buildLoginUrlAsync(app: AuthApp, nonce: AuthNonce, customParams = {}) {
        const cachedUser = await this.getCachedUserAsync();

        const base =
            'https://login.microsoftonline.com/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/oauth2/authorize';
        const params: any = {
            ...customParams,
            client_id: app.clientId,
            response_type: 'id_token',
            redirect_uri: getTopLevelWindow(window).location.origin.split('#')[0],
            nonce: nonce.getKey(),
            login_hint: cachedUser ? cachedUser.upn : null,
        };

        const queryString = Object.keys(params)
            .filter((key) => params[key])
            .reduce(
                (query, key) =>
                    query + `${query ? '&' : ''}${key}=${encodeURIComponent(params[key])}`,
                ''
            );

        return base + '?' + queryString;
    }

    protected resolveApp(resource: string): AuthApp | null {
        const resourceOrigin = AuthContainer.getResourceOrigin(resource);
        const app = this.apps.find(
            (app) =>
                app.resources.some((r) => r === resource) ||
                app.resources.indexOf(resourceOrigin) !== -1 ||
                app.clientId === resourceOrigin ||
                app.clientId === resource
        );

        if (typeof app === 'undefined') {
            return null;
        }

        return app;
    }
}
