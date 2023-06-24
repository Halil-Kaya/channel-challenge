import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { User } from '../../../core/interface';

@Injectable()
export class UserInternalService {
    constructor(private readonly userRepository: UserRepository) {}

    findByNickname(nickname: string): Promise<User> {
        return this.userRepository.findByNickname(nickname);
    }

}
