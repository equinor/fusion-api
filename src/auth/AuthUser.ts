import AuthToken from './AuthToken';
import JSON from '../utils/JSON';

class UserTokenMissmatchError extends Error {}

export type AuthUserJSON = {
    id: string;
    fullName: string;
    givenName: string;
    familyName: string;
    upn: string;
    roles: string[];
};

export default class AuthUser {
    static createFromToken(token: AuthToken): AuthUser {
        const user = new AuthUser(token.id, null);
        user.mergeWithToken(token);
        return user;
    }

    static fromJSON(json: AuthUserJSON): AuthUser {
        return new AuthUser(json.id, json);
    }

    private constructor(id: string, json: AuthUserJSON | null) {
        this._id = id;

        if (json !== null) {
            this._fullName = json.fullName;
            this._givenName = json.givenName;
            this._familyName = json.familyName;
            this._upn = json.upn;
            this._roles = json.roles;
        }
    }

    private _id: string;
    private _fullName: string = '';
    private _givenName: string = '';
    private _familyName: string = '';
    private _upn: string = '';
    private _roles: string[] = [];

    get id(): string {
        return this._id;
    }

    get fullName(): string {
        return this._fullName;
    }

    get givenName(): string {
        return this._givenName;
    }

    get familyName(): string {
        return this._familyName;
    }

    get roles(): string[] {
        return this._roles.map((role) => role);
    }

    get upn(): string {
        return this._upn;
    }

    mergeWithToken(token: AuthToken) {
        if (token.id !== this.id) {
            throw new UserTokenMissmatchError();
        }

        this._fullName = token.fullName;
        this._givenName = token.givenName;
        this._familyName = token.familyName;
        this._upn = token.upn;

        if (token.roles) {
            token.roles.forEach((role) => {
                if (this._roles.indexOf(role) === -1) {
                    this._roles.push(role);
                }
            });
        }
    }

    toObject(): AuthUserJSON {
        return {
            id: this.id,
            familyName: this.familyName,
            fullName: this.fullName,
            givenName: this.givenName,
            roles: this.roles,
            upn: this.upn,
        };
    }

    toString(): string {
        return JSON.stringify(this.toObject());
    }
}
