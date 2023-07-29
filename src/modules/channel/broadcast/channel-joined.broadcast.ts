import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMqQueueName } from '../../../core/const';
import { BroadcastEvent, Channel } from '../../../core/interface';
import { ChannelBroadcast } from '../../../core/enum';

export interface ChannelJoinedBroadcastEvent {
    channel: Channel;
}

@Injectable()
export class ChannelJoinedBroadcast {
    @RabbitSubscribe({
        routingKey: ChannelBroadcast.CHANNEL_JOINED,
        queue: RabbitMqQueueName
    })
    public async handle(msg: BroadcastEvent<ChannelJoinedBroadcastEvent>) {
        console.log({ msg });
    }
}
