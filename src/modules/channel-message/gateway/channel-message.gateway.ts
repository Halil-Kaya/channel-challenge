import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelMessageGatewayEvent } from '../../../core/enum';

@Injectable()
export class ChannelMessageGateway {
    constructor() {}

    @EventHandler(ChannelMessageGatewayEvent.CHANNEL_SEND_MESSAGE)
    channelMessageSend() {}
}
