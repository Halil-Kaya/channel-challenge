import { Injectable } from '@nestjs/common';
import { UserSessionCacheRepository } from '../repository';
import { User } from '../../../core/interface';

@Injectable()
export class UserSessionInternalService {
    constructor(private readonly userSessionCacheRepository: UserSessionCacheRepository) {}

    save(user: Omit<User, 'password'>): Promise<void> {
        return this.userSessionCacheRepository.save(user);
    }

    deleteCache(userId: string): Promise<void> {
        return this.userSessionCacheRepository.deleteCache(userId);
    }

    findOnlineUserIds() {}
}
