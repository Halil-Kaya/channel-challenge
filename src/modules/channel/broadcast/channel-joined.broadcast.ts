import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMqQueueName } from '../../../core/const';
import { BroadcastEvent, Channel } from '../../../core/interface';
import { ChannelBroadcast } from '../../../core/enum';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { UserSessionInternalService } from '../../user/service';

export interface ChannelJoinedBroadcastEvent {
    channel: Channel;
}

@Injectable()
export class ChannelJoinedBroadcast {
    constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly userSessionIntervalService: UserSessionInternalService
    ) {}

    @RabbitSubscribe({
        exchange: 'channel-challenge',
        routingKey: ChannelBroadcast.CHANNEL_JOINED,
        queue: RabbitMqQueueName
    })
    public async handle({ client, payload, reqId }: BroadcastEvent<ChannelJoinedBroadcastEvent>) {
        const userSession = await this.userSessionIntervalService.getSessionUser(client._id);
        this.eventPublisher.publish(userSession.nodeId, {
            reqId,
            payload,
            client
        });
    }
}
