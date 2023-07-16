import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { User } from '../../../core/interface';
import { UnauthorizedException } from '../../../core/error';
import { UserSessionInternalService } from '../../user/service';

@Injectable()
export class AuthProvider {
    constructor(
        private readonly authService: AuthService,
        private readonly userSessionInternalService: UserSessionInternalService
    ) {}

    async auth(token: string) {
        const user = await this.authService.getUserByToken(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        await this.userSessionInternalService.save(user);
        return user;
    }

    async disconnect(user: User) {
        await this.userSessionInternalService.deleteCache(user._id);
    }
}
