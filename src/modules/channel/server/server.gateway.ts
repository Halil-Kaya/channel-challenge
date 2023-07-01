import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CryptoService } from '../../../core/service';
import { logger } from '../../../core/logger/logger';
import { AuthProvider } from './provider/auth.provider';

@WebSocketGateway({
    transports: ['websocket'],
    cors: {
        origin: '*'
    }
})
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server;

    constructor(private readonly authProvider: AuthProvider, private readonly cryptoService: CryptoService) {}

    afterInit(server: Server) {
        server.use(async (socket: Socket, next) => {
            try {
                const startTime = Date.now();
                const { token } = <{ token: string }>this.cryptoService.decrypt(socket.handshake?.query?.data + '');
                socket.data.user = await this.authProvider.auth(token);
                logger.info({
                    reqId: socket.id,
                    user: socket.data.user,
                    event: 'user_connection',
                    respTime: Date.now() - startTime,
                    method: 'SOCKET'
                });
                next();
            } catch (err) {
                logger.warn({
                    event: 'socket-auth'
                });
                next(err);
            }
        });
    }
    async handleConnection(socket: Socket) {}
    async handleDisconnect(socket: Socket) {
        await this.authProvider.disconnect(socket.data.user);
    }
}
