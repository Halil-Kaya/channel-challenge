import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Global()
@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
    exports: [AuthService]
})
export class AuthModule {}
