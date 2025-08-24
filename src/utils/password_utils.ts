import crypto from "crypto";

export function hashPassword(password: string, salt?: string) {
    salt = salt || crypto.randomBytes(16).toString("hex"); // генерируем соль
    const hashed = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return { salt, hashed };
}

export function verifyPassword(password: string, hash: string, salt: string) {
    const hashVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
    return hash === hashVerify;
}
