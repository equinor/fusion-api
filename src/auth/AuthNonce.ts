import * as uuid from "uuid/v1";
import AuthApp from "./AuthApp";

export class FusionNonceNotFoundError extends Error {
    constructor(key: string) {
        super(`Unable to find nonce [${key}]`);
    }
}

export default class AuthNonce {
    private key: string;
    private value: string;

    private static createCacheKey(key: string): string {
        return `FUSION_AUTH_NONCE:${key}`;
    }

    static createNew(app: AuthApp): AuthNonce {
        const id = uuid();
        const nonce = new AuthNonce(id, app.clientId);
        sessionStorage.setItem(AuthNonce.createCacheKey(nonce.key), nonce.toString());
        return nonce;
    }

    static resolve(key: string): AuthNonce {
        const cacheKey = AuthNonce.createCacheKey(key);
        const value = sessionStorage.getItem(cacheKey);

        if (!value) {
            throw new FusionNonceNotFoundError(key);
        }

        const nonce = new AuthNonce(key, value);

        sessionStorage.removeItem(cacheKey);

        return nonce;
    }

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    getKey(): string {
        return this.key;
    }

    validate(nonce: AuthNonce): boolean {
        return nonce && nonce.value === this.value;
    }
}
