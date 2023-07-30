import { Module } from '@nestjs/common';
import { ChannelMessageGateway } from './gateway/channel-message.gateway';

@Module({
    imports: [ChannelMessageGateway],
    providers: []
})
export class ChannelMessageModule {}
