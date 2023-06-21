import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserInternalService } from '../../user/service';
import { SignInAck, SignInDto } from '../controller/dto';
import { UnauthorizedException } from '../../../core/error';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from '../../../core/interface';

@Injectable()
export class AuthService {
    constructor(private readonly userInternalService: UserInternalService, private readonly jwtService: JwtService) {}

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
