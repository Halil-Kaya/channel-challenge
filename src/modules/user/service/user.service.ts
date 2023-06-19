import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { User } from "../../../core/interface";
import { ClientSession } from 'mongoose';
import { NicknameAlreadyTakenException } from '../../../core/error';
import { cacheKeys } from "../../../core/cache";
import { cacheTTL } from "../../../core/cache";
import { LockService } from "../../../core/service";
import { UserCreateAck } from '../controller/ack/user-create.ack';
import { UserCreateDto } from '../controller/dto';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly lockService: LockService) {}

    async save(user: UserCreateDto, session?: ClientSession): Promise<UserCreateAck> {
        const lock = await this.lockService.lock(cacheKeys.nickname(user.nickname), {
            ttl: cacheTTL.lock.nickname
        });
        const existUser = await this.userRepository.findByNickname(user.nickname);
        if (existUser) {
            throw new NicknameAlreadyTakenException();
        }
        await this.userRepository.save(user, session);
        await lock.release();
        return;
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
