const b64DecodeUnicode = (str: string) =>
    decodeURIComponent(
        Array.prototype.map
            .call(atob(str), (c: any) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );

class FusionAuthTokenParseError extends Error {
    constructor(token: string) {
        super(`Unable to parse token [${token}]`);
    }
}

export default class AuthToken {
    static parse(token: string): AuthToken {
        const userPart = token.split(".")[1];
        const parsedToken = JSON.parse(b64DecodeUnicode(userPart));

        if(!parsedToken) {
            throw new FusionAuthTokenParseError(token);
        }

        return new AuthToken(token, parsedToken.nonce);
    }

    originalToken: string;
    nonce: string;
    expiration: number;

    constructor(originalToken: string, parsedToken: any) {
        this.originalToken = originalToken;
        this.nonce = parsedToken.nonce;
        this.expiration = parsedToken.exp;
    }

    toString() {
        return this.originalToken;
    }

    isValid(): boolean {
        const now = Math.floor(new Date().getTime() / 1000);

        if (now >= this.expiration) {
            return false;
        }

        return true;
    }
}