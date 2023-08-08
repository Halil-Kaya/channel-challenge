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
import { AuthProvider } from '../provider/auth.provider';
import { SocketMiddleware } from '../middleware';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { SocketEmit, UnseenChannelMessageBroadcastEvent, User } from '../../../core/interface';
import { ChannelMessageBroadcast, DecoratorMetaKey } from '../../../core/enum';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';

@WebSocketGateway({
    transports: ['websocket'],
    cors: {
        origin: '*'
    }
})
export class ServerGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private readonly server: Server;

    constructor(
        private readonly authProvider: AuthProvider,
        private readonly cryptoService: CryptoService,
        private readonly socketMiddleware: SocketMiddleware,
        private readonly discoveryService: DiscoveryService,
        private readonly eventPublisher: EventPublisher
    ) {}

    public getServer() {
        return this.server;
    }

    public getSocketById(socketId: string): Socket | undefined {
        if (!this.server) {
            return undefined;
        }
        return this.server.sockets.sockets.get(socketId);
    }

    public getAllSockets() {
        return this.server.sockets.sockets;
    }

    public async getSocketOfChannel(channelId: string) {
        return this.server.in(channelId).fetchSockets();
    }

    private receiveUnseenMessages(socket: Socket, reqId: string) {
        const user = <User>socket.data.user;

        this.eventPublisher.publishToBroadcast<UnseenChannelMessageBroadcastEvent>(
            ChannelMessageBroadcast.UNSEEN_CHANNEL_MESSAGE,
            {
                client: {
                    _id: user._id,
                    fullName: user.fullName,
                    isOnline: true,
                    nickname: user.nickname,
                    createdAt: user.createdAt
                },
                reqId,
                payload: { userId: user._id }
            }
        );
    }

    afterInit(server: Server) {
        server.use(async (socket: Socket, next) => {
            try {
                const startTime = Date.now();
                const { token } = <{ token: string }>this.cryptoService.decrypt(socket.handshake?.query?.data + '');
                socket.data['connectionTime'] = Date.now();
                socket.data.user = await this.authProvider.auth(token, socket.id);
                await this.authProvider.joinChannels(socket.data.user._id, socket);
                this.receiveUnseenMessages(socket, socket.id);
                logger.info({
                    reqId: socket.id,
                    user: socket.data.user,
                    event: 'user_connection',
                    respTime: Date.now() - startTime,
                    method: 'SOCKET',
                    type: 'EMIT'
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
    async handleConnection(socket: Socket) {
        this.socketMiddleware.register(socket);
        await this.registerHandlers(socket);
    }
    async handleDisconnect(socket: Socket) {
        await this.authProvider.leaveChannels(socket.data.user._id, socket);
        await this.authProvider.disconnect(socket.data.user);
        logger.info({
            reqId: socket.id,
            user: socket.data.user,
            event: 'user_disconnect',
            method: 'SOCKET',
            type: 'ACK',
            meta: {
                connectionTime: Date.now() - socket.data['connectionTime']
            }
        });
    }

    private async registerHandlers(socket: Socket) {
        const methods = await this.discoveryService.providerMethodsWithMetaAtKey(DecoratorMetaKey.EVENT_HANDLER);
        for (const method of methods) {
            const meta = method.meta as { event: string };
            const event = meta.event;
            const that = method.discoveredMethod.parentClass.instance;
            const handler = method.discoveredMethod.handler;
            const boundHandler = handler.bind(that);
            socket.on(event, async (packet: SocketEmit<any>, callBack) => {
                const startTime = Date.now();
                const { reqId, client } = packet;
                try {
                    const response = await boundHandler(packet);
                    logger.info({
                        reqId,
                        user: client,
                        type: 'ACK',
                        body: response,
                        method: 'SOCKET',
                        respTime: Date.now() - startTime,
                        event
                    });
                    callBack(null, this.cryptoService.encrypt(response || {}));
                } catch (err) {
                    logger.warn({
                        event,
                        user: client,
                        type: 'ACK',
                        err,
                        method: 'SOCKET',
                        respTime: Date.now() - startTime,
                        reqId
                    });
                    callBack(this.cryptoService.encrypt(err));
                }
            });
        }
    }
}
