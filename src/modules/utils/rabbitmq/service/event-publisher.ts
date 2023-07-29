import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { BroadcastEvent, Environment } from '../../../../core/interface';
import { logger } from '../../../../core/logger/logger';
import { ChannelBroadcast } from '../../../../core/enum';

@Injectable()
export class EventPublisher {
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService<Environment>
    ) {}

    publish<T>(routingKey: ChannelBroadcast, payload: BroadcastEvent<T>) {
        this.amqpConnection
            .publish(
                this.configService.get('RABBITMQ_EXCHANGES_NAME'),
                ChannelBroadcast.CHANNEL_JOINED,
                Buffer.from(JSON.stringify(payload), 'utf8')
            )
            .catch((err) => {
                logger.warn({
                    body: {
                        routingKey,
                        payload
                    },
                    err,
                    event: 'rabbitmq-send-event',
                    message: 'RabbitMQ could not send event'
                });
            });
    }
}
