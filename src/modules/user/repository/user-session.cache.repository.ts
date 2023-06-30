import { Injectable } from '@nestjs/common';
import { User } from '../../../core/interface';

@Injectable()
export class UserSessionCacheRepository {
    constructor() {}

    async save(user: User): Promise<void> {
        return;
    }

    serializeUser(user: User) {
        return {
            _id: user._id.toString(),
            fullName: user.fullName,
            nickname: user.nickname,
            password: user.password,
            createdAt: user.createdAt.toISOString()
        };
    }

    deserializeUser(serializedUser): User {
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
