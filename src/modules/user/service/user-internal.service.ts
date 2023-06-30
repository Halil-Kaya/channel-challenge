import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { User } from '../../../core/interface';

@Injectable()
export class UserInternalService {
    constructor(private readonly userRepository: UserRepository) {}

    findByNickname(nickname: string): Promise<Omit<User, 'password'>> {
        return this.userRepository.findByNickname(nickname);
    }

    findByNicknameForAuth(nickname: string): Promise<User> {
        return this.userRepository.findByNicknameInMongo(nickname);
    }

    createFakeUser(): Promise<User> {
        return this.userRepository.save({
            nickname: Math.random().toString(36).slice(2, 16),
            fullName: Math.random().toString(36).slice(2, 16),
            password: Math.random().toString(36).slice(2, 16)
        });
    }
}
