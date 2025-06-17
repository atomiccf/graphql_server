import jwt from 'jsonwebtoken';

export interface UserData {
    userId: string;
    username: string;
    password?: string;
}

function getSecretKey(): string {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
        throw new Error("SECRET_KEY env variable is not defined");
    }
    return secret.trim().replace(/\\n/g, '\n');
}

export function createJWT(userData: UserData): string | undefined {
    try {
        const secret = getSecretKey();
        const accessToken = jwt.sign(userData, secret, { algorithm: 'RS256', expiresIn: '30m' });
        return accessToken;
    } catch (e) {
        console.error("Error generating JWT:", e);
        return undefined;
    }
}

export function createRefreshToken(userData: UserData): string | undefined {
    try {
        const secret = getSecretKey();
        const refreshToken = jwt.sign(userData, secret, { algorithm: 'RS256', expiresIn: '1d' });
        return refreshToken;
    } catch (e) {
        console.error("Error generating JWT:", e);
        return undefined;
    }
}
