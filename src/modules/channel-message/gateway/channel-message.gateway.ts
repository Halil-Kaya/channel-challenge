import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelMessageGatewayEvent } from '../../../core/enum';
import { SocketEmit } from '../../../core/interface';
import { ChannelSendMessageAck, ChannelSendMessageEmit } from '../emit';
import { ChannelMessageService } from '../service/channel-message.service';

@Injectable()
export class ChannelMessageGateway {
    constructor(private readonly channelMessageService: ChannelMessageService) {}

    @EventHandler(ChannelMessageGatewayEvent.CHANNEL_SEND_MESSAGE)
    channelMessageSend(dto: SocketEmit<ChannelSendMessageEmit>): Promise<ChannelSendMessageAck> {
        return this.channelMessageService.sendMessage(dto);
    }
}
