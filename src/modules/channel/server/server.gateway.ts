import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({})
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server;

    constructor() {}

    afterInit(server: Server) {
        console.log('afterInit calisti');
    }
    handleConnection(socket: Socket) {
        console.log('baglandi');
    }
    handleDisconnect(socket: Socket) {
        console.log('baglanti koptu');
    }
}
