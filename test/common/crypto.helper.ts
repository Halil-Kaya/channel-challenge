import { createCipheriv, createDecipheriv } from 'crypto';
import { testConfig } from '../test-config';

const encryptionMethod = 'AES-256-ECB';
const key = testConfig.cryptoPassword;
export function encrypt(data: object): { data: string } {
    const cipher = createCipheriv(encryptionMethod, Buffer.from(key, 'hex'), Buffer.alloc(0));
    const encrpyted = cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64');
    return { data: encrpyted };
}

export function decrypt(encryptedData: string): any {
    if (encryptedData == null) {
        return null;
    }
    const decipher = createDecipheriv(encryptionMethod, Buffer.from(key, 'hex'), Buffer.alloc(0).toString('utf8'));
    return JSON.parse(decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8'));
}
