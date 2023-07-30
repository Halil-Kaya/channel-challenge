import { Injectable } from '@nestjs/common';
import { EventHandler } from '../../../core/decorator';
import { ChannelEvents } from '../../../core/enum';
import { SocketEmit } from '../../../core/interface';
import {
    ChannelCreateAck,
    ChannelCreateEmit,
    ChannelJoinAck,
    ChannelJoinEmit,
    ChannelLeaveAck,
    ChannelLeaveEmit,
    ChannelSearchAck,
    ChannelSearchEmit
} from '../emit';
import { ChannelService } from '../service/channel.service';

@Injectable()
export class ChannelGateway {
    constructor(private readonly channelService: ChannelService) {}

    @EventHandler(ChannelEvents.CHANNEL_CREATE)
    channelCreate(dto: SocketEmit<ChannelCreateEmit>): Promise<ChannelCreateAck> {
        return this.channelService.save(dto);
    }

    @EventHandler(ChannelEvents.CHANNEL_SEARCH)
    channelSearch(dto: SocketEmit<ChannelSearchEmit>): Promise<ChannelSearchAck[]> {
        return this.channelService.search(dto);
    }

    @EventHandler(ChannelEvents.CHANNEL_JOIN)
    channelJoin(dto: SocketEmit<ChannelJoinEmit>): Promise<ChannelJoinAck> {
        return this.channelService.join(dto);
    }

    @EventHandler(ChannelEvents.CHANNEL_LEAVE)
    channelLeave(dto: SocketEmit<ChannelLeaveEmit>): Promise<ChannelLeaveAck> {
        return this.channelService.leave(dto);
    }
}
