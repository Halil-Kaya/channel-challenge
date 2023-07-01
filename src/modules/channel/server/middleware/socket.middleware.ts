import { Injectable } from '@nestjs/common';
import { ReqIdMiddleware } from './req-id.middleware';
import { Socket } from 'socket.io';
import { AdjustPackageMiddleware } from './adjust-package.middleware';
import { CurrentUserMiddleware } from './current-user.middleware';
import { LoggerMiddleware } from './logger.middleware';
import { DecryptMiddleware } from './decrypt.middleware';

@Injectable()
export class SocketMiddleware {
    constructor(
        private readonly reqIdMiddleware: ReqIdMiddleware,
        private readonly adjustPackageMiddleware: AdjustPackageMiddleware,
        private readonly currentUserMiddleware: CurrentUserMiddleware,
        private readonly loggerMiddleware: LoggerMiddleware,
        private readonly decryptMiddleware: DecryptMiddleware
    ) {}

    register(socket: Socket) {
        socket.use((packet, next) => {
            this.adjustPackageMiddleware.use(packet);
            this.reqIdMiddleware.use(packet);
            this.currentUserMiddleware.use(socket, packet);
            this.decryptMiddleware.use(packet);
            this.loggerMiddleware.use(socket, packet);
            next();
        });
    }
}
