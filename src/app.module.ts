import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from './core/interface/environment.interface';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './modules/auth/auth.module';
import { ChannelModule } from './modules/channel/channel.module';
import { UserModule } from './modules/user/user.module';
import { RedisLockModule } from '@huangang/nestjs-simple-redis-lock';

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
        ChannelModule,
        UserModule
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
