import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from './core/interface';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CryptoService } from './core/service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/interceptor';
import { DevModule } from './modules/dev/dev.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { ChannelModule } from './modules/channel/channel.module';
import { ChannelUserModel } from './modules/channel-user/model/channel-user.model';
import { ChannelMessageModule } from './modules/channel-message/channel-message.module';

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
        UserModule,
        DevModule,
        GatewayModule,
        ChannelModule,
        ChannelUserModel,
        ChannelMessageModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor
        },
        CryptoService
    ]
})
export class AppModule {}
