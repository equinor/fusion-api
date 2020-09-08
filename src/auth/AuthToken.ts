import JSON from '../utils/JSON';

const b64DecodeUnicode = (str: string) =>
    decodeURIComponent(
        Array.prototype.map
            .call(atob(str), (c: any) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

export class FusionAuthTokenParseError extends Error {
    constructor(token: string) {
        super(`Unable to parse token [${token}]`);
    }
}

export default class AuthToken {
    static parse(token: string): AuthToken {
        const userPart = token.split('.')[1];
        const parsedToken = JSON.parse<ParsedBearerToken>(b64DecodeUnicode(userPart));

        if (!parsedToken) {
            throw new FusionAuthTokenParseError(token);
        }

        return new AuthToken(token, parsedToken);
    }

    private constructor(originalToken: string, parsedToken: ParsedBearerToken) {
        this._originalToken = originalToken;
        this._parsedToken = parsedToken;
    }

    private _parsedToken: ParsedBearerToken;
    private _originalToken: string;

    get id(): string {
        return this._parsedToken.oid;
    }

    get fullName(): string {
        return this._parsedToken.name;
    }

    get givenName(): string {
        return this._parsedToken.given_name;
    }

    get familyName(): string {
        return this._parsedToken.family_name;
    }

    get originalToken(): string {
        return this._originalToken;
    }

    get nonce(): string {
        return this._parsedToken.nonce;
    }

    get expiration(): number {
        return this._parsedToken.exp;
    }

    get roles(): string[] {
        return this._parsedToken.roles;
    }

    get upn(): string {
        return this._parsedToken.upn;
    }

    toString() {
        return this._originalToken;
    }

    isValid(): boolean {
        const now = Math.floor(new Date().getTime() / 1000);

        if (now >= this.expiration) {
            return false;
        }

        return true;
    }
}

type ParsedBearerToken = {
    acr: string;
    aio: string;
    amr: string[];
    appid: string;
    appidacr: string;
    aud: string; // TODO: Validate
    nonce: string;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    ipaddr: number;
    iss: string;
    name: string;
    nbf: number;
    oid: string;
    onprem_sid: string;
    roles: string[];
    scp: string;
    sub: string;
    tid: string;
    unique_name: string;
    upn: string;
    uti: string;
    ver: string;
};

// acr: "1"
// aio: "42ZgYHDl4Ba7+Z0zRlhC57aS46T1UQaOBQu/2Sj9mFC8cor82hkA"
// amr: ["pwd"]
// appid: "97978493-9777-4d48-b38a-67b0b9cd88d2"
// appidacr: "2"
// aud: "97978493-9777-4d48-b38a-67b0b9cd88d2"
// exp: 1557841951
// family_name: "Førre"
// given_name: "Martin"
// iat: 1557838051
// ipaddr: "213.236.148.45"
// iss: "https://sts.windows.net/3aa4a235-b6e2-48d5-9195-7fcf05b459b0/"
// name: "Martin Førre"
// nbf: 1557838051
// oid: "4c20d82f-019b-453a-b451-b89a9d21e2ff"
// onprem_sid: "S-1-5-21-220523388-1085031214-725345543-2282328"
// roles: (2) ["ProView.Admin.Help", "ProView.Admin.DevOps"]
// scp: "AllSites.Manage Calendars.Read Calendars.ReadWrite Calendars.ReadWrite.Shared Contacts.Read.Shared Group.ReadWrite.All Mail.Send offline_access openid People.Read Sites.Read.All Sites.Search.All Tasks.ReadWrite.Shared User.Read User.ReadBasic.All"
// sub: "wVysWC2Rqwl0ncVHklN8UMYwPVcP3Z7vDejP1V6kPgk"
// tid: "3aa4a235-b6e2-48d5-9195-7fcf05b459b0"
// unique_name: "MFORR@equinor.com"
// upn: "MFORR@equinor.com"
// uti: "pRyAiw7wLE6pBchoSkJpAA"
// ver: "1.0"
