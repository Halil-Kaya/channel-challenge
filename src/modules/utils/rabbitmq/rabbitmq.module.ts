import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventPublisher } from './service/event-publisher';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../../../core/interface';

@Module({
    imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [],
            useFactory: async (configService: ConfigService<Environment>) => ({
                exchanges: [
                    {
                        name: configService.get('RABBITMQ_EXCHANGES_NAME'),
                        type: configService.get('RABBITMQ_EXCHANGE_TYPE')
                    }
                ],
                uri: configService.get('RABBITMQ_NODE_CONNECTION_URL')
            }),
            inject: [ConfigService]
        })
    ],
    providers: [EventPublisher],
    exports: [EventPublisher]
})
export class CustomRabbitMqModule {}
