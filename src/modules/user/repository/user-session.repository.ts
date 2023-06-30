import { Injectable } from '@nestjs/common';
import { UserSessionCacheRepository } from './user-session.cache.repository';
import { User } from '../../../core/interface';

@Injectable()
export class UserSessionRepository {
    constructor(private readonly userSessionCacheRepository: UserSessionCacheRepository) {}

    save(user: User): Promise<void> {
        return this.userSessionCacheRepository.save(user);
    }
}
