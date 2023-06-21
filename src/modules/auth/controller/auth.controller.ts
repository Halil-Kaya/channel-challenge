import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignInDto } from './dto';
import { SignInAck } from './ack';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    signIn(@Body() dto: SignInDto): Promise<SignInAck> {
        return this.authService.signIn(dto);
    }
}
