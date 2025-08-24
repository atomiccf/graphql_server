import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

export interface UserData {
    userId: string;
    username: string;
    password?: string;
}

function getSecretKey(): string {
    const secret = process.env.JWT_PRIVATE_KEY;
    if (!secret) {
        throw new Error("SECRET_KEY env variable is not defined");
    }

    return secret.trim().replace(/\\n/g, '\n');
}

export function createJWT(userData: UserData): string | undefined {
    try {
        const secret = getSecretKey();
        const accessToken = jwt.sign(userData, secret, { algorithm: 'HS256', expiresIn: '30m' });
        return accessToken;
    } catch (e) {
        console.error("Error generating JWT:", e);
        return undefined;
    }
}

export function createRefreshToken(userData: UserData): string | undefined {
    try {
        const secret = getSecretKey();
        const refreshToken = jwt.sign(userData, secret, { algorithm: 'HS256', expiresIn: '1d' });
        return refreshToken;
    } catch (e) {
        console.error("Error generating JWT:", e);
        return undefined;
    }

}

export async function verifyGoogleToken(token:string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    if (!token) return null;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        return payload;

    } catch (e) {
        console.error("Error verifying Google ID token:", e);
        return null;
    }
}
