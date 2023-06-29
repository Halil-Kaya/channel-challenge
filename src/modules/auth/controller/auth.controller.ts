import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInAck, SignInDto } from './dto';
import { ApiException, ApiResponseSchema } from '../../../core/decorator';
import { UnauthorizedException } from '../../../core/error';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiException(UnauthorizedException)
    @ApiResponseSchema()
    @Post('sign-in')
    async signIn(@Body() dto: SignInDto): Promise<SignInAck> {
        return this.authService.signIn(dto);
    }
}
