import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment } from './environment.interface';

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
        })
    ],
    controllers: [],
    providers: []
})
export class AppModule {}
