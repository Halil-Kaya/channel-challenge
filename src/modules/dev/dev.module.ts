import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DevController } from './controller/dev.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [UserModule, AuthModule],
    controllers: [DevController],
    providers: [JwtService]
})
export class DevModule {}
