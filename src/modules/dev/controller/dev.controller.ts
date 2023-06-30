import { Body, Controller, Post } from '@nestjs/common';
import { UserInternalService } from '../../user/service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Environment, JwtPayload } from '../../../core/interface';

@Controller('dev')
export class DevController {
    constructor(
        private readonly userInternalService: UserInternalService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<Environment>
    ) {}

    @Post('have-users')
    async haveUsers(@Body() dto: { count: number }) {
        const response = await Promise.all([
            ...new Array(dto.count).fill(0).map(async () => {
                const user = await this.userInternalService.createFakeUser();
                const payload: JwtPayload = {
                    _id: user._id,
                    nickname: user.nickname
                };
                const token = await this.jwtService.signAsync(payload, {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRES')
                });
                return {
                    user: {
                        _id: user._id,
                        nickname: user.nickname,
                        fullName: user.fullName,
                        createdAt: user.createdAt
                    },
                    token
                };
            })
        ]);
        return {
            response
        };
    }
}
