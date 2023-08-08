import { Injectable } from '@nestjs/common';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { UserSessionInternalService } from '../../user/service';
import { RabbitmqQueueuHandler } from '../../../core/decorator';
import { ChannelMessageBroadcast } from '../../../core/enum';
import {
    BroadcastEvent,
    ChannelMessageSocketEmitEvent,
    ChannelSendMessageBroadcastEvent,
    UnseenChannelMessageBroadcastEvent,
    UnseenChannelMessagesSocketEmitEvent
} from '../../../core/interface';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { BackendOriginated } from '../../../core/enum/backend-originated.enum';
import { UnseenChannelMessageInternalService } from '../service';
import { ChannelMessageInternalService } from '../service/channel-message-internal.service';

@Injectable()
export class ChannelMessageBroadcastHandler {
    constructor(
        private readonly eventPublisher: EventPublisher,
        private readonly userSessionIntervalService: UserSessionInternalService,
        private readonly channelUserInternalService: ChannelUserInternalService,
        private readonly unseenChannelMessageService: UnseenChannelMessageInternalService,
        private readonly channelMessageInternalServcie: ChannelMessageInternalService
    ) {}

    @RabbitmqQueueuHandler(ChannelMessageBroadcast.CHANNEL_MESSAGE_SEND)
    async handleChannelMessageSend({ payload, client, reqId }: BroadcastEvent<ChannelSendMessageBroadcastEvent>) {
        const { message } = payload;
        const channelUsers = await this.channelUserInternalService.getUsersOfChannel(message.channelId);
        const channelUserIds = channelUsers.map((channelUser) => channelUser.userId);
        const sessions = await this.userSessionIntervalService.getSessionUsers(channelUserIds);
        const onlineUserIds = sessions.map((session) => session.userId);
        const offlineUserIds = channelUserIds.filter((channelUserId) => !onlineUserIds.includes(channelUserId));

        await this.unseenChannelMessageService.bulkWrite(
            offlineUserIds.map((offlineUserId) => {
                return {
                    messageId: message.messageId,
                    userId: offlineUserId
                };
            })
        );

        const senderSession = sessions.find((session) => session.userId == client._id);
        this.eventPublisher.publishToSocketFanout<ChannelMessageSocketEmitEvent>({
            reqId,
            client,
            channelId: payload.message.channelId,
            userSessions: sessions,
            event: BackendOriginated.CHANNEL_MESSAGE,
            payload: {
                channelMessage: payload.message
            },
            shouldSenderReceive: false,
            senderSession
        });
    }

    @RabbitmqQueueuHandler(ChannelMessageBroadcast.UNSEEN_CHANNEL_MESSAGE)
    async handleUnseenChannelMessage({ payload, client, reqId }: BroadcastEvent<UnseenChannelMessageBroadcastEvent>) {
        const { userId } = payload;
        const userSession = await this.userSessionIntervalService.getSessionUser(userId);
        const unseenMessagesOfUser = await this.unseenChannelMessageService.getUnseenMessagesByUserId(userId);

        const messages = await this.channelMessageInternalServcie.getMessagesByIds(
            unseenMessagesOfUser.map((unseenMessage) => unseenMessage.messageId)
        );

        this.eventPublisher.publishToSocket<UnseenChannelMessagesSocketEmitEvent>(userSession.nodeId, {
            reqId,
            userSession,
            client,
            payload: {
                unseenChannelMessages: messages.map((message) => {
                    return {
                        message: message.message,
                        sender: message.sender,
                        channelId: message.channelId,
                        messageId: message._id,
                        createdAt: message.createdAt,
                        seenCount: message.seenCount
                    };
                })
            },
            event: BackendOriginated.UNSEEN_CHANNEL_MESSAGES
        });
    }
}
