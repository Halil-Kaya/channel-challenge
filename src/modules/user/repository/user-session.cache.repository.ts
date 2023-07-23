import { Injectable } from '@nestjs/common';
import { SessionUser, User } from '../../../core/interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheKeys } from '../../../core/cache';
import { NodeIdHelper } from '../../../core/helper';

@Injectable()
export class UserSessionCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(user: Omit<User, 'password'>): Promise<void> {
        await this.redis.hset(cacheKeys.session_user(user._id), this.serializeUserSession(user));
    }

    async deleteCache(userId: string): Promise<void> {
        await this.redis.del(cacheKeys.session_user(userId));
    }

    serializeUserSession(user: Omit<User, 'password'>): SessionUser {
        return {
            _id: user._id.toString(),
            nickname: user.nickname,
            nodeId: NodeIdHelper.getNodeId()
        };
    }
}
