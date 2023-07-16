import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class CurrentUserMiddleware {
    constructor() {}
    use(socket: Socket, packet: [string, ...unknown[]]) {
        packet[1]['client'] = socket.data.user;
    }
}
