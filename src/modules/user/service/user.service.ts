import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { UserDocument } from '../model/user.model';
import { User } from '../../../core/interface/mongo-model/user.interface';
import { ClientSession } from 'mongoose';
import { NicknameAlreadyTakenException } from '../../../core/error';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession): Promise<UserDocument> {
        //TODO add redlock mechanizm
        const existUser = await this.userRepository.findByNickname(user.nickname);
        if (existUser) {
            throw new NicknameAlreadyTakenException();
        }
        return this.userRepository.save(user, session);
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
