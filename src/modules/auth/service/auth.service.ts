import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInternalService } from '../../user/service';
import { SignInAck, SignInDto } from '../controller/dto';
import { UnauthorizedException } from '../../../core/error';
import * as bcrypt from 'bcryptjs';
import { Environment, JwtPayload, User } from '../../../core/interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userInternalService: UserInternalService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<Environment>
    ) {}

    async getUserByToken(token: string): Promise<User> {
        return this.jwtService.verifyAsync(token, {
            secret: this.configService.get('JWT_SECRET')
        });
    }

    async signIn(signInDto: SignInDto): Promise<SignInAck> {
        const { nickname, password } = signInDto;
        const user = await this.userInternalService.findByNickname(nickname);
        if (!user) {
            throw new UnauthorizedException();
        }
        const isPasswordMatch = bcrypt.compare(user.password, password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException();
        }
        const payload: JwtPayload = user;
        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
