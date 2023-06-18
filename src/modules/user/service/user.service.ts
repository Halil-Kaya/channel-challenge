import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { UserDocument } from '../model/user.model';
import { User } from '../../../core/interface/mongo-model/user.interface';
import { ClientSession } from 'mongoose';
import { NicknameAlreadyTakenException } from '../../../core/error';
import { cacheKeys } from '../../../core/cache/cache-key';
import { cacheTTL } from '../../../core/cache/cache-ttl';
import { LockService } from '../../../core/service/lock.service';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly lockService: LockService) {}

    async save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession): Promise<UserDocument> {
        const lock = await this.lockService.lock(cacheKeys.nickname(user.nickname), {
            ttl: cacheTTL.lock.nickname
        });
        const existUser = await this.userRepository.findByNickname(user.nickname);
        if (existUser) {
            throw new NicknameAlreadyTakenException();
        }
        const createdUser = this.userRepository.save(user, session);
        await lock.release();
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
