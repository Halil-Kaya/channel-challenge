import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelMessageGatewayEvent } from '../../../core/enum';
import { SocketEmit } from '../../../core/interface';
import {
    ChannelMessagesGetAck,
    ChannelMessagesGetEmit,
    ChannelMessagesReadEmit,
    ChannelSendMessageAck,
    ChannelSendMessageEmit
} from '../emit';
import { ChannelMessageService } from '../service';
import { ChannelMessagesReadAck } from '../emit';

@Injectable()
export class ChannelMessageGateway {
    constructor(private readonly channelMessageService: ChannelMessageService) {}

    @EventHandler(ChannelMessageGatewayEvent.CHANNEL_SEND_MESSAGE)
    channelMessageSend(dto: SocketEmit<ChannelSendMessageEmit>): Promise<ChannelSendMessageAck> {
        return this.channelMessageService.sendMessage(dto);
    }

    @EventHandler(ChannelMessageGatewayEvent.CHANNEL_MESSAGES_READ)
    channelMessageRead(dto: SocketEmit<ChannelMessagesReadEmit>): Promise<ChannelMessagesReadAck> {
        return this.channelMessageService.readMessages(dto);
    }

    @EventHandler(ChannelMessageGatewayEvent.CHANNEL_MESSAGES_GET)
    channelMessagesGet(dto: SocketEmit<ChannelMessagesGetEmit>): Promise<ChannelMessagesGetAck> {
        return this.channelMessageService.getMessages(dto);
    }
}
