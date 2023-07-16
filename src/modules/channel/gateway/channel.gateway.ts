import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelEvents } from '../../../core/enum/channel-gateway.enum';
import { SocketEmit } from '../../../core/interface';
import { ChannelCreateAck, ChannelCreateEmit } from '../emit';
import { ChannelService } from '../service/channel.service';

@Injectable()
export class ChannelGateway {
    constructor(private readonly channelService: ChannelService) {}

    @EventHandler(ChannelEvents.CHANNEL_CREATE)
    async channelCreate(dto: SocketEmit<ChannelCreateEmit>): Promise<ChannelCreateAck> {
        return this.channelService.save(dto);
    }
}
