import { Injectable } from '@nestjs/common';
import { UserMongoRepository } from './user.mongo.repository';
import { UserCacheRepository } from './user.cache.repository';
import { User } from '../../../core/interfaces/mongo-model/user.interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class UserRepository {
    constructor(
        private readonly userMongoRepository: UserMongoRepository,
        private readonly userCacheRepository: UserCacheRepository
    ) {}

    async save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession) {
        const existUser = await this.userMongoRepository.findByNickname(user.nickname);
        if (existUser) {
            //TODO: throw error
        }
        const createdUser = await this.userMongoRepository.save(user, session);
        await this.userCacheRepository.save(createdUser);
        return createdUser;
    }

    async findById(userId: string): Promise<User> {
        const userCache = await this.userCacheRepository.getUserById(userId);
        if (userCache) {
            return userCache;
        }
        const userMongo = await this.userMongoRepository.findById(userId);
        if (userMongo) {
            await this.userCacheRepository.save(userMongo);
            return userMongo;
        }
        return null;
    }

    async findByNickname(nickname: string): Promise<User> {
        return this.userMongoRepository.findByNickname(nickname);
    }

    async updatePassword(userId: string, newPassword: string) {
        await this.userMongoRepository.updatePassword(userId, newPassword);
        await this.userCacheRepository.deleteCache(userId);
    }
}
