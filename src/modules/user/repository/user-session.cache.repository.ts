import { Injectable } from '@nestjs/common';
import { UserSession, User, SerializedUserSession } from '../../../core/interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { cacheKeys } from '../../../core/cache';
import { isObjEmpty, NodeIdHelper } from '../../../core/helper';

@Injectable()
export class UserSessionCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(user: Omit<User, 'password'>, socketId: string): Promise<void> {
        const userSession = this.convertUserToSessionUserObjcet(user, socketId);
        await this.redis.hset(cacheKeys.session_user(user._id), this.serializeUserSession(userSession));
    }

    async deleteCache(userId: string): Promise<void> {
        await this.redis.del(cacheKeys.session_user(userId));
    }

    async getSessionUser(userId: string): Promise<UserSession> {
        const userSessionCache: SerializedUserSession = <SerializedUserSession>(
            await this.redis.hgetall(cacheKeys.session_user(userId))
        );
        if (!userSessionCache || isObjEmpty(userSessionCache)) {
            return null;
        }
        return this.deserializeUserSession(userSessionCache);
    }

    private convertUserToSessionUserObjcet(user: Omit<User, 'password'>, socketId: string): UserSession {
        return {
            userId: user._id.toString(),
            nickname: user.nickname,
            nodeId: NodeIdHelper.getNodeId(),
            socketId: socketId
        };
    }

    private serializeUserSession(sessionUser: UserSession): SerializedUserSession {
        return {
            ...sessionUser
        };
    }

    private deserializeUserSession(serializedUserSession: SerializedUserSession): UserSession {
        return {
            ...serializedUserSession
        };
    }
}
