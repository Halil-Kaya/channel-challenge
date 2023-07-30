import { Injectable } from '@nestjs/common';
import { ServerGateway } from '../gateway/server.gateway';
import { NodeIdHelper } from '../../../core/helper';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import { SocketEmitBroadcast } from '../../../core/enum';
import { ChannelJoinedSocketEmitEvent, ChannelLeftSocketEmitEvent, SocketEmitEvent } from '../../../core/interface';
import { CryptoService } from '../../../core/service';

@Injectable()
export class SocketBroadcastEmitHandler {
    constructor(private readonly serverGateway: ServerGateway, private readonly crpytoService: CryptoService) {}

    @RabbitmqQueueuHandler(NodeIdHelper.getNodeId() + SocketEmitBroadcast.CHANNEL_JOINED)
    private async joinChannel({ userSession, payload }: SocketEmitEvent<ChannelJoinedSocketEmitEvent>) {
        const socket = this.serverGateway.getSocketById(userSession.socketId);
        socket.join(payload.channelId);
    }

    @RabbitmqQueueuHandler(NodeIdHelper.getNodeId() + SocketEmitBroadcast.CHANNEL_LEFT)
    private async leaveChannel({ userSession, payload }: SocketEmitEvent<ChannelLeftSocketEmitEvent>) {
        const socket = this.serverGateway.getSocketById(userSession.socketId);
        socket.leave(payload.channelId);
    }

    @RabbitmqQueueuHandler(NodeIdHelper.getNodeId())
    private async handleIndividual({ payload, userSession, event }: SocketEmitEvent<any>) {
        const socket = this.serverGateway.getSocketById(userSession.socketId);
        socket.emit(event, this.crpytoService.encrypt(payload));
    }
}
