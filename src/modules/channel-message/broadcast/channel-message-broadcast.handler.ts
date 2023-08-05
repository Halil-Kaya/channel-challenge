import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { UserSessionInternalService } from '../../user/service';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import { ChannelMessageBroadcast } from '../../../core/enum';
import {
    BroadcastEvent,
    ChannelMessageSocketEmitEvent,
    ChannelSendMessageBroadcastEvent
} from '../../../core/interface';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { BackendOriginated } from '../../../core/enum/backend-originated.enum';

@Injectable()
export class ChannelMessageBroadcastHandler {
    constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly userSessionIntervalService: UserSessionInternalService,
        private readonly channelUserInternalService: ChannelUserInternalService
    ) {}

    @RabbitmqQueueuHandler(ChannelMessageBroadcast.CHANNEL_MESSAGE_SEND)
    async handleChannelMessageSend({ payload, client, reqId }: BroadcastEvent<ChannelSendMessageBroadcastEvent>) {
        const { message } = payload;
        const channelUsers = await this.channelUserInternalService.getUsersOfChannel(message.channelId);
        const channelUserIds = channelUsers.map((channelUser) => channelUser.userId);
        const sessions = await this.userSessionIntervalService.getSessionUsers(channelUserIds);
        const onlineUserIds = sessions.map((session) => session.userId);
        const offlineUserIds = channelUserIds.filter((channelUserId) => !onlineUserIds.includes(channelUserId));

        //TODO : offlien olanlar icin mesaji kaydet

        this.eventPublisher.publishToSocketFanout<ChannelMessageSocketEmitEvent>({
            reqId,
            client,
            channelId: payload.message.channelId,
            userSessions: sessions,
            event: BackendOriginated.CHANNEL_MESSAGE,
            payload: {
                channelMessage: payload.message
            }
        });
    }
}
