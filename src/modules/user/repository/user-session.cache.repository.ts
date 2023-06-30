import { Injectable } from '@nestjs/common';
import { User } from '../../../core/interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheKeys } from '../../../core/cache';

@Injectable()
export class UserSessionCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(user: Omit<User, 'password'>): Promise<void> {
        await this.redis.hset(cacheKeys.session_user, user._id, user.nickname);
    }

    async deleteCache(userId: string): Promise<void> {
        await this.redis.hdel(cacheKeys.session_user, userId);
    }
}
