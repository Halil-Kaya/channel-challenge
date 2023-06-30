import { Injectable } from '@nestjs/common';
import { UserSessionRepository } from '../repository';
import { User } from '../../../core/interface';

@Injectable()
export class UserSessionInternalService {
    constructor(private readonly userSessionRepository: UserSessionRepository) {}

    save(user: User) {}

    deleteByUserId() {}

    findOnlineUserIds() {}

    getByUserId() {}
}
