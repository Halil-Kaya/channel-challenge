import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { UserDocument } from '../model/user.model';
import { User } from '../../../core/interface/mongo-model/user.interface';
import { ClientSession } from 'mongoose';
import { NicknameAlreadyTakenException } from '../../../core/error';
import { RedisLockService } from '@huangang/nestjs-simple-redis-lock';
import { cacheKeys } from '../../../core/cache/cache-key';
import { cacheTTL } from '../../../core/cache/cache-ttl';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly lockService: RedisLockService) {}

    async save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession): Promise<UserDocument> {
        await this.lockService.lock(cacheKeys.nickname(user.nickname), cacheTTL.lock.nickname);
        const existUser = await this.userRepository.findByNickname(user.nickname);
        if (existUser) {
            throw new NicknameAlreadyTakenException();
        }
        const createdUser = this.userRepository.save(user, session);
        await this.lockService.unlock(cacheKeys.nickname(user.nickname));
        return createdUser;
    }

    findById(userId: string): Promise<User> {
        return this.userRepository.findById(userId);
    }

    findByNickname(nickname: string): Promise<User> {
        return this.userRepository.findByNickname(nickname);
    }

    async updatePasswrod(userId: string, newPassword: string): Promise<void> {
        await this.userRepository.updatePassword(userId, newPassword);
    }
}
