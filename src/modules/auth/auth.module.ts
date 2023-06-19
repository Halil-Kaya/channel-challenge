import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '../../core/interface';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<Environment>) => ({
                global: true,
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.get('JWT_EXPIRES') }
            }),
            inject: [ConfigService]
        }),
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AuthModule {}
