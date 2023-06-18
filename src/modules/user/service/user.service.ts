import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { UserDocument } from '../model/user.model';
import { User } from '../../../core/interfaces/mongo-model/user.interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession): Promise<UserDocument> {
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
