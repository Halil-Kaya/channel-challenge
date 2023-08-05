import { Injectable, OnModuleInit } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
    ChannelBroadcast,
    ChannelMessageBroadcast,
    DecoratorMetaKey,
    SocketEmitBroadcast
} from '../../../../core/enum';
import { NodeIdHelper } from '../../../../core/helper';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { logger } from '../../../../core/logger/logger';
import { BroadcastEvent, SocketEmitEvent } from '../../../../core/interface';

@Injectable()
export class EventPublisher implements OnModuleInit {
    private readonly handlersMap = new Map();
    constructor(private readonly amqpConnection: AmqpConnection, private readonly discoveryService: DiscoveryService) {}

    publishToBroadcast<T>(queueName: ChannelBroadcast | string, payload: BroadcastEvent<T>) {
        logger.info({
            event: queueName,
            body: payload,
            reqId: payload.reqId,
            user: payload.client,
            method: 'RABBITMQ',
            type: 'EMIT',
            content: 'Rabbitmq - send broadcast event'
        });
        this.amqpConnection.managedChannels['pubSub']
            .sendToQueue(queueName, Buffer.from(JSON.stringify(payload), 'utf8'))
            .catch((err) => {
                logger.error({
                    err,
                    event: queueName,
                    body: payload,
                    reqId: payload.reqId,
                    user: payload.client,
                    method: 'RABBITMQ',
                    type: 'EMIT',
                    content: 'Rabbitmq - could not send broadcast event'
                });
            });
    }

    publishToSocket<T>(queueName: SocketEmitBroadcast | string, payload: SocketEmitEvent<T>) {
        logger.info({
            event: queueName,
            body: payload,
            reqId: payload.reqId,
            user: payload.client,
            method: 'RABBITMQ',
            type: 'EMIT',
            content: 'Rabbitmq - send socket event'
        });
        this.amqpConnection.managedChannels['pubSub']
            .sendToQueue(queueName, Buffer.from(JSON.stringify(payload), 'utf8'))
            .catch((err) => {
                logger.error({
                    err,
                    event: queueName,
                    body: payload,
                    reqId: payload.reqId,
                    user: payload.client,
                    meta: {
                        userSession: payload.userSession
                    },
                    method: 'RABBITMQ',
                    type: 'EMIT',
                    content: 'Rabbitmq - could not send socket emit event'
                });
            });
    }

    //TODO bunun tek bir kuyruga degil bir den fazla kuyruga gondermesi gerekiyor
    publishToSocketFanout<T>(payload: any) {
        logger.info({
            event: SocketEmitBroadcast.FANOUT,
            body: payload,
            reqId: payload.reqId,
            user: payload.client,
            method: 'RABBITMQ',
            type: 'EMIT',
            content: 'Rabbitmq - send socket fanout event'
        });
        this.amqpConnection.managedChannels['pubSub']
            .publish('exchange-direct', SocketEmitBroadcast.FANOUT, Buffer.from(JSON.stringify(payload), 'utf8'))
            .catch((err) => {
                logger.error({
                    err,
                    event: SocketEmitBroadcast.FANOUT,
                    body: payload,
                    reqId: payload.reqId,
                    user: payload.client,
                    meta: {
                        userSessions: payload.userSessions
                    },
                    method: 'RABBITMQ',
                    type: 'EMIT',
                    content: 'Rabbitmq - could not send socket fanout emit event'
                });
            });
    }

    async onModuleInit() {
        const methods = await this.discoveryService.providerMethodsWithMetaAtKey(
            DecoratorMetaKey.RABBITMQ_QUEUE_HANDLER
        );
        methods.map((method) => {
            const meta = method.meta as { queue: string };
            const queue = meta.queue;
            const that = method.discoveredMethod.parentClass.instance;
            const handler = method.discoveredMethod.handler;
            const boundHandler = handler.bind(that);
            this.handlersMap.set(queue, boundHandler);
        });
        const queueNames = [
            ...Object.values(ChannelBroadcast),
            ...Object.values(ChannelMessageBroadcast),
            ...Object.values(SocketEmitBroadcast).map((value) => NodeIdHelper.getNodeId() + value),
            NodeIdHelper.getNodeId()
        ];
        const fanoutQueueNames = [SocketEmitBroadcast.FANOUT];
        await this.amqpConnection.managedChannels['pubSub'].assertExchange('exchange-direct', 'direct', {
            durable: true
        });
        await Promise.all([
            ...fanoutQueueNames.map(async (fanoutQueuName) => {
                await this.amqpConnection.managedChannels['pubSub'].assertQueue(
                    NodeIdHelper.getNodeId() + fanoutQueuName
                );
                await this.amqpConnection.managedChannels['pubSub'].bindQueue(
                    NodeIdHelper.getNodeId() + fanoutQueuName,
                    'exchange-direct',
                    fanoutQueuName
                );
            }),
            ...queueNames.map(async (queueName) => {
                await this.amqpConnection.managedChannels['pubSub'].assertQueue(queueName);
                await this.amqpConnection.managedChannels['pubSub'].consume(queueName, async (msg) => {
                    const fields = msg.fields;
                    const body: SocketEmitEvent<any> | BroadcastEvent<any> = JSON.parse(msg.content.toString());
                    try {
                        logger.info({
                            method: 'RABBITMQ',
                            body,
                            user: body.client,
                            event: queueName,
                            reqId: body.reqId,
                            type: 'ACK'
                        });
                        const boundHandler = this.handlersMap.get(queueName);
                        await boundHandler(body);
                        this.amqpConnection.channels['pubSub'].ack(msg, false);
                    } catch (err) {
                        logger.error({
                            method: 'RABBITMQ',
                            meta: { fields, queueName },
                            body,
                            event: queueName,
                            user: body.client,
                            err,
                            reqId: body.reqId,
                            type: 'ACK'
                        });
                        this.amqpConnection.channels['pubSub'].reject(msg, false);
                    }
                });
            })
        ]);
    }
}
