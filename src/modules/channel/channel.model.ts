import { Module } from '@nestjs/common';
import { ChannelGateway } from './channel/channel.gateway';
import { ChannelMessageGateway } from './channel-message/channel-message.gateway';
import { ChannelUserGateway } from './channel-user/channel-user.gateway';
import { ServerGateway } from './server/server.gateway';

@Module({
    imports: [],
    controllers: [],
    providers: [ChannelGateway, ChannelMessageGateway, ChannelUserGateway, ServerGateway]
})
export class ChannelModule {}
