import { Injectable } from '@nestjs/common';
import { User } from '../../../core/interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheKeys, cacheTTL } from '../../../core/cache';
import { SerializedUser } from '../../../core/interface';

@Injectable()
export class UserCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(user: Omit<User, 'password'>): Promise<void> {
        const cacheKey = cacheKeys.user(user._id);
        const serializedUser: SerializedUser = this.serializeUser(user);
        await Promise.all([
            this.redis.hset(cacheKey, serializedUser),
            this.redis.hset(cacheKeys.nickname_map, user.nickname, user._id)
        ]);
        await this.redis.pexpire(cacheKey, cacheTTL.user.user);
    }

    async getUserById(userId: string): Promise<Omit<User, 'password'>> {
        const cacheKey = cacheKeys.user(userId);
        const userCache: SerializedUser = <SerializedUser>await this.redis.hgetall(cacheKey);
        if (!userCache) {
            return null;
        }
        return this.deserializeUser(userCache);
    }

    async getUserByNickname(nickname: string): Promise<Omit<User, 'password'>> {
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

    private serializeUser(user: Omit<User, 'password'>): SerializedUser {
        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            nickname: user.nickname,
            createdAt: user.createdAt.toISOString()
        };
    }

    private deserializeUser(serializedUser: SerializedUser): Omit<User, 'password'> {
        return {
            ...serializedUser,
            _id: serializedUser._id,
            fullName: serializedUser.fullName,
            nickname: serializedUser.nickname,
            createdAt: new Date(serializedUser.createdAt)
        };
    }
}
