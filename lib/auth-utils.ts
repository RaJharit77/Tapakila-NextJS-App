import crypto from 'crypto';

export function hashSync(password: string, saltRounds = 10): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, saltRounds, 64, 'sha512')
        .toString('hex');
    return `${salt}:${hash}`;
}

export function compareSync(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(':');
    const derivedHash = crypto
        .pbkdf2Sync(password, salt, 10, 64, 'sha512')
        .toString('hex');
    return hash === derivedHash;
}