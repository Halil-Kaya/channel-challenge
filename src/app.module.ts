import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from './core/interface';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: 'environments/.env',
            isGlobal: true
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<Environment>) => ({
                uri: configService.get<string>('MONGO_CONNECTION_URL')
            }),
            inject: [ConfigService]
        }),
        RedisModule.forRootAsync({
            imports: [],
            useFactory: async (configService: ConfigService<Environment>) => ({
                config: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT')
                }
            }),
            inject: [ConfigService]
        }),
        AuthModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
