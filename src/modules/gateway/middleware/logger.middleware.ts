import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { logger } from '../../../core/logger/logger';
import { SocketEmit } from '../../../core/interface';

@Injectable()
export class LoggerMiddleware {
    constructor() {}

    use(socket: Socket, packets: [string, ...unknown[]]) {
        const { reqId, payload, client } = <SocketEmit<any>>packets[1];
        logger.info({
            method: 'SOCKET',
            reqId,
            user: client,
            body: payload,
            type: 'EMIT',
            event: packets[0]
        });
    }
}
