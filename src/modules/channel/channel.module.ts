import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel/gateway/channel.gateway';
import { ChannelMessageGateway } from './channel-message/channel-message.gateway';
import { ChannelUserGateway } from './channel-user/channel-user.gateway';
import { ServerGateway } from './server/server.gateway';
import { CryptoService } from '../../core/service';
import { AuthProvider } from './server/provider/auth.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import {
    AdjustPackageMiddleware,
    CurrentUserMiddleware,
    DecryptMiddleware,
    LoggerMiddleware,
    ReqIdMiddleware,
    SocketMiddleware
} from './server/middleware';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelFactory } from './channel/model/channel.model';
import { ChannelService } from './channel/service/channel.service';
import { ChannelCacheRepository, ChannelMongoRepository, ChannelRepository } from './channel/repository';

@Module({
    imports: [UserModule, AuthModule, DiscoveryModule, MongooseModule.forFeatureAsync([ChannelFactory])],
    controllers: [],
    providers: [
        ChannelGateway,
        ChannelMessageGateway,
        ChannelUserGateway,
        ServerGateway,
        CryptoService,
        AuthProvider,
        SocketMiddleware,
        ReqIdMiddleware,
        AdjustPackageMiddleware,
        CurrentUserMiddleware,
        LoggerMiddleware,
        DecryptMiddleware,
        ChannelService,
        ChannelRepository,
        ChannelMongoRepository,
        ChannelCacheRepository
    ]
})
export class ChannelModule {}
