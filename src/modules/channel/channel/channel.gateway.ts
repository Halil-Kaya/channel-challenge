import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelEvents } from '../../../core/enum/channel-gateway.enum';
import { SocketEmit } from '../../../core/interface';
import { ChannelCreateAck, ChannelCreateEmit } from './emit';

@Injectable()
export class ChannelGateway {
    constructor() {}

    @EventHandler(ChannelEvents.CHANNEL_CREATE)
    async channelCreate(payload: SocketEmit<ChannelCreateEmit>): Promise<ChannelCreateAck> {
        return payload;
    }
}
