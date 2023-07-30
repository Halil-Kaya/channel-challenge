import { Injectable } from '@nestjs/common';
import { ChannelBroadcast, SocketEmitBroadcast } from '../../../core/enum';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { UserSessionInternalService } from '../../user/service';
import { BackendOriginated } from '../../../core/enum/backend-originated.enum';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import {
    BroadcastEvent,
    ChannelJoinedBroadcastEvent,
    ChannelJoinedSocketEmitEvent,
    ChannelLeftBroadcastEvent,
    ChannelLeftSocketEmitEvent
} from '../../../core/interface';

@Injectable()
export class ChannelBroadcastHandler {
    constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly userSessionIntervalService: UserSessionInternalService
    ) {}

    @RabbitmqQueueuHandler(ChannelBroadcast.CHANNEL_JOINED)
    private async handleChannelJoined({ client, payload, reqId }: BroadcastEvent<ChannelJoinedBroadcastEvent>) {
        const userSession = await this.userSessionIntervalService.getSessionUser(client._id);
        this.eventPublisher.publishToSocket<ChannelJoinedSocketEmitEvent>(
            userSession.nodeId + SocketEmitBroadcast.CHANNEL_JOINED,
            {
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
            }
        );
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
            event: BackendOriginated.CHANNEL_JOINED
        });
    }

    @RabbitmqQueueuHandler(ChannelBroadcast.CHANNEL_LEFT)
    private async handleChannelLeft({ client, payload, reqId }: BroadcastEvent<ChannelLeftBroadcastEvent>) {
        const userSession = await this.userSessionIntervalService.getSessionUser(client._id);
        this.eventPublisher.publishToSocket<ChannelLeftSocketEmitEvent>(
            userSession.nodeId + SocketEmitBroadcast.CHANNEL_LEFT,
            {
                reqId,
                userSession,
                client,
                payload: {
                    channelId: payload.channelId
                },
                event: SocketEmitBroadcast.CHANNEL_LEFT
            }
        );
        this.eventPublisher.publishToSocket<ChannelLeftSocketEmitEvent>(userSession.nodeId, {
            reqId,
            userSession,
            client,
            payload: {
                channelId: payload.channelId
            },
            event: BackendOriginated.CHANNEL_LEFT
        });
    }
}
