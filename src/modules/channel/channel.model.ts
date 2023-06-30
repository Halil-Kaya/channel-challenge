import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel/channel.gateway';
import { ChannelMessageGateway } from './channel-message/channel-message.gateway';
import { ChannelUserGateway } from './channel-user/channel-user.gateway';
import { ServerGateway } from './server/server.gateway';
import { CryptoService } from '../../core/service';
import { AuthProvider } from './server/provider/auth.provider';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [UserModule, AuthModule],
    controllers: [],
    providers: [ChannelGateway, ChannelMessageGateway, ChannelUserGateway, ServerGateway, CryptoService, AuthProvider]
})
export class ChannelModule {}
