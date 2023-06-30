import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    pingTimeout: 30000,
    pingInterval: 25000
})
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server;

    constructor() {}

    afterInit(server: any): any {}
    handleConnection(client: any, ...args): any {}
    handleDisconnect(client: any): any {}
}
