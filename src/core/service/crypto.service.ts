import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../interface';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
    private readonly key: string;
    private readonly encryptionMethod = 'AES-256-ECB';

    constructor(private readonly configSerivce: ConfigService<Environment>) {
        this.key = this.configSerivce.get('CRYPTO_PASSWORD');
    }

    encrypt(data: object): string {
        const cipher = createCipheriv(this.encryptionMethod, this.hex2bin(this.key), Buffer.alloc(0));
        return cipher.update(JSON.stringify(data), 'utf8', 'base64') + cipher.final('base64');
    }

    decrypt(encryptedData: string): object {
        const decipher = createDecipheriv(
            this.encryptionMethod,
            this.hex2bin(this.key),
            Buffer.alloc(0).toString('utf8')
        );
        return JSON.parse(decipher.update(encryptedData, 'base64', 'utf8') + decipher.final('utf8'));
    }

    generateReqId() {
        return (Math.random() + 1).toString(36).substring(2);
    }

    private hex2bin(hex: string) {
        return Buffer.from(hex, 'hex');
    }
}
