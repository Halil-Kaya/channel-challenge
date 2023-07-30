import { Injectable } from '@nestjs/common';
import { ChannelBroadcast, SocketEmitBroadcast } from '../../../core/enum';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { UserSessionInternalService } from '../../user/service';
import { BackendOrginated } from '../../../core/enum/backend-originated.enum';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import { BroadcastEvent, ChannelJoinedBroadcastEvent, ChannelJoinedSocketEmitEvent } from '../../../core/interface';

@Injectable()
export class ChannelBroadcastHandler {
    constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly userSessionIntervalService: UserSessionInternalService
    ) {}

    @RabbitmqQueueuHandler(ChannelBroadcast.CHANNEL_JOINED)
    public async handleChannelJoined({ client, payload, reqId }: BroadcastEvent<ChannelJoinedBroadcastEvent>) {
        const userSession = await this.userSessionIntervalService.getSessionUser(client._id);
        this.eventPublisher.publishToSocket<ChannelJoinedSocketEmitEvent>(SocketEmitBroadcast.CHANNEL_JOINED, {
            reqId,
            userSession,
            client,
            payload: {
                channelId: payload.channel._id,
                name: payload.channel.name,
                description: payload.channel.description,
                createdAt: payload.channel.createdAt
            },
            event: SocketEmitBroadcast.CHANNEL_JOINED
        });
        this.eventPublisher.publishToSocket<ChannelJoinedSocketEmitEvent>(userSession.nodeId, {
            reqId,
            userSession,
            client,
            payload: {
                channelId: payload.channel._id,
                name: payload.channel.name,
                description: payload.channel.description,
                createdAt: payload.channel.createdAt
            },
            event: BackendOrginated.CHANNEL_JOINED
        });
    }
}
