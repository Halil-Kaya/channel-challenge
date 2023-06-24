import { Injectable } from '@nestjs/common';
import { User } from '../../../core/interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheKeys, cacheTTL } from '../../../core/cache';

type SerializedUser = Record<keyof User, string>;

@Injectable()
export class UserCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(user: User): Promise<void> {
        const cacheKey = cacheKeys.user(user._id);
        const serializedUser: SerializedUser = this.serializeUser(user);
        await Promise.all([
            this.redis.hset(cacheKey, serializedUser),
            this.redis.hset(cacheKeys.nickname_map, user.nickname, user._id)
        ]);
        await Promise.all([
            this.redis.expire(cacheKey, cacheTTL.user.user),
            this.redis.expire(cacheKeys.nickname_map, cacheTTL.user.nickname)
        ]);
    }

    async getUserById(userId: string): Promise<User> {
        const cacheKey = cacheKeys.user(userId);
        const userCache = <SerializedUser>await this.redis.hgetall(cacheKey);
        if (!userCache) {
            return null;
        }
        return this.deserializeUser(userCache);
    }

    async getUserByNickname(nickname: string): Promise<User> {
        const userId = await this.getUserIdByNickname(nickname);
        if (userId == null) {
            return;
        }
        return this.getUserById(userId);
    }

    async getUserIdByNickname(nickname: string) {
        const userId = await this.redis.hget(cacheKeys.nickname_map, nickname);
        if (userId === null) {
            return null;
        }
        return userId;
    }

    async deleteCache(userId: string): Promise<void> {
        const cacheKey = cacheKeys.user(userId);
        await this.redis.del(cacheKey);
    }

    serializeUser(user: User): SerializedUser {
        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            nickname: user.nickname,
            password: user.password,
            createdAt: user.createdAt.toISOString()
        };
    }

    deserializeUser(serializedUser: SerializedUser): User {
        return {
            ...serializedUser,
            _id: serializedUser._id,
            fullName: serializedUser.fullName,
            nickname: serializedUser.nickname,
            password: serializedUser.password,
            createdAt: new Date(serializedUser.createdAt)
        };
    }
}
