import { Injectable } from '@nestjs/common';
import { UserSessionCacheRepository } from '../repository';
import { UserSession, User } from '../../../core/interface';

@Injectable()
export class UserSessionInternalService {
    constructor(private readonly userSessionCacheRepository: UserSessionCacheRepository) {}

    save(user: Omit<User, 'password'>, socketId: string): Promise<void> {
        return this.userSessionCacheRepository.save(user, socketId);
    }

    getSessionUser(userId: string): Promise<UserSession> {
        return this.userSessionCacheRepository.getSessionUser(userId);
    }

    async getSessionUsers(userIds: string[]): Promise<UserSession[]> {
        const sessions = await this.userSessionCacheRepository.getSessionUsers(userIds);
        return sessions.filter((session) => session != null);
    }

    deleteCache(userId: string): Promise<void> {
        return this.userSessionCacheRepository.deleteCache(userId);
    }
}
