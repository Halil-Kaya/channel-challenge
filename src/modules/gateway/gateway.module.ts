import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@golevelup/nestjs-discovery';
import { ServerGateway } from './gateway/server.gateway';
import { CryptoService } from '../../core/service';
import { AuthProvider } from './provider/auth.provider';
import {
    AdjustPackageMiddleware,
    CurrentUserMiddleware,
    DecryptMiddleware,
    LoggerMiddleware,
    ReqIdMiddleware,
    SocketMiddleware
} from './middleware';
import { UserModule } from '../user/user.module';
import { SocketBroadcastEmitHandler } from './broadcast/socket-broadcast-emit.handler';
import { CustomRabbitMqModule } from '../utils/rabbitmq/rabbitmq.module';
import { ChannelUserModule } from '../channel-user/channel-user.module';

@Module({
    imports: [DiscoveryModule, UserModule, CustomRabbitMqModule, ChannelUserModule],
    providers: [
        ServerGateway,
        CryptoService,
        AuthProvider,
        SocketMiddleware,
        ReqIdMiddleware,
        AdjustPackageMiddleware,
        CurrentUserMiddleware,
        LoggerMiddleware,
        DecryptMiddleware,
        SocketBroadcastEmitHandler
    ]
})
export class GatewayModule {}
