import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInAck, SignInDto } from './dto';
import { ApiResponseSchema } from '../../../core/decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiResponseSchema()
    @Post('sign-in')
    async signIn(@Body() dto: SignInDto): Promise<SignInAck> {
        return this.authService.signIn(dto);
    }
}
