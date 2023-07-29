import { Injectable } from '@nestjs/common';
import { ServerGateway } from '../gateway/server.gateway';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMqQueueName } from '../../../core/const';
import { NodeIdHelper } from '../../../core/helper';

@Injectable()
export class SocketEmitService {
    constructor(private readonly serverGateway: ServerGateway) {}

    @RabbitSubscribe({
        routingKey: NodeIdHelper.getNodeId(),
        queue: RabbitMqQueueName
    })
    async handleIndividual(paylaod: any) {
        console.log('handleIndividual event geldi');
    }
}
