import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { User } from '../../../core/interface';
import { UnauthorizedException } from '../../../core/error';
import { UserSessionInternalService } from '../../user/service';
import { Socket } from 'socket.io';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';

@Injectable()
export class AuthProvider {
    constructor(
        private readonly authService: AuthService,
        private readonly userSessionInternalService: UserSessionInternalService,
        private readonly channelUserInternalService: ChannelUserInternalService
    ) {}

    async auth(token: string, socketId: string) {
        const user = await this.authService.getUserByToken(token);
        if (!user) {
            throw new UnauthorizedException();
        }
        await this.userSessionInternalService.save(user, socketId);
        return user;
    }

    async joinChannels(userId: string, socket: Socket) {
        const channelUsers = await this.channelUserInternalService.getChannelUserById(userId);
        const channelIds = channelUsers.map((channelUser) => channelUser.channelId);
        socket.join(channelIds);
    }

    async leaveChannels(userId: string, socket: Socket) {
        const channelUsers = await this.channelUserInternalService.getChannelUserById(userId);
        const channelIds = channelUsers.map((channelUser) => channelUser.channelId);
        channelIds.forEach((channelId) => {
            socket.leave(channelId);
        });
    }

    async disconnect(user: User) {
        await this.userSessionInternalService.deleteCache(user._id);
    }
}
