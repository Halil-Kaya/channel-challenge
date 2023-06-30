import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { ClientSession } from 'mongoose';
import { NicknameAlreadyTakenException, RaceConditionException } from '../../../core/error';
import { cacheKeys } from '../../../core/cache';
import { cacheTTL } from '../../../core/cache';
import { LockService } from '../../../core/service';
import { UpdatePasswordDto, UserCreateAck, UserCreateDto } from '../dto';
import { Client } from '../../../core/interface/client.interface';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly lockService: LockService) {}

    async save(user: UserCreateDto, session?: ClientSession): Promise<UserCreateAck> {
        let lock;
        try {
            lock = await this.lockService.lock(cacheKeys.nickname(user.nickname), {
                ttl: cacheTTL.lock.nickname,
                noRetry: true
            });
        } catch (err) {
            throw new RaceConditionException(`RaceCond: ${cacheKeys.nickname(user.nickname)}`);
        }

        const existUser = await this.userRepository.findByNickname(user.nickname);
        if (existUser) {
            throw new NicknameAlreadyTakenException();
        }
        await this.userRepository.save(user, session);
        await lock.release();
        return;
    }

    async updatePasswrod(client: Client, updatePasswordDto: UpdatePasswordDto): Promise<void> {
        await this.userRepository.updatePassword(client._id, updatePasswordDto.newPassword);
    }
}
