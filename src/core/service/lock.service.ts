import { Injectable } from '@nestjs/common';
import Redlock from 'redlock';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheTTL } from "../cache";

@Injectable()
export class LockService {
    private readonly redlock: Redlock;

    constructor(@InjectRedis() private readonly redis: Redis) {
        this.redlock = new Redlock([redis]);
    }

    async lock(key: string, options: { ttl?: number; noRetry?: boolean } = {}) {
        const { ttl = cacheTTL.lock.default, noRetry = false } = options;
        return this.redlock.acquire([key], ttl, {
            retryCount: noRetry ? 0 : 25
        });
    }
}
