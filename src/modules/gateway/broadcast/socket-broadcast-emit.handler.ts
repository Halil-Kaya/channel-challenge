import { Injectable } from '@nestjs/common';
import { ServerGateway } from '../gateway/server.gateway';
import { NodeIdHelper } from '../../../core/helper';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import { SocketEmitBroadcast } from '../../../core/enum';
import { ChannelJoinedSocketEmitEvent, ChannelLeftSocketEmitEvent, SocketEmitEvent } from '../../../core/interface';

@Injectable()
export class SocketBroadcastEmitHandler {
    constructor(private readonly serverGateway: ServerGateway) {}

    @RabbitmqQueueuHandler(SocketEmitBroadcast.CHANNEL_JOINED)
    async joinChannel({ userSession, payload }: SocketEmitEvent<ChannelJoinedSocketEmitEvent>) {
        const socket = this.serverGateway.getSocketById(userSession.socketId);
        socket.join(payload.channelId);
    }

    @RabbitmqQueueuHandler(SocketEmitBroadcast.CHANNEL_LEFT)
    async leaveChannel({ userSession, payload }: SocketEmitEvent<ChannelLeftSocketEmitEvent>) {
        const socket = this.serverGateway.getSocketById(userSession.socketId);
        socket.leave(payload.channelId);
    }

    @RabbitmqQueueuHandler(NodeIdHelper.getNodeId())
    async handleIndividual({ payload, reqId, userSession, event }: SocketEmitEvent<any>) {
        console.log('SocketBroadcastEmitHandler,handleIndividual -> ', {});
    }
}
