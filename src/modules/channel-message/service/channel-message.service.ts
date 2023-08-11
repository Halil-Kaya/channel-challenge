import { Injectable } from '@nestjs/common';
import { ChannelMessageReadRepository, ChannelMessageRepository, UnseenChannelMessageRepository } from '../repository';
import { ChannelSendMessageBroadcastEvent, SocketEmit } from '../../../core/interface';
import {
    ChannelMessagesReadAck,
    ChannelMessagesReadEmit,
    ChannelSendMessageAck,
    ChannelSendMessageEmit
} from '../emit';
import { ChannelInternalService } from '../../channel/service';
import { ChannelNotFoundException, RaceConditionException, UserNotInChannelException } from '../../../core/error';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { ChannelMessageBroadcast } from '../../../core/enum';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { cacheKeys, cacheTTL } from '../../../core/cache';
import { LockService } from '../../../core/service';

@Injectable()
export class ChannelMessageService {
    constructor(
        private readonly channelMessageRepository: ChannelMessageRepository,
        private readonly channelInternalService: ChannelInternalService,
        private readonly channelUserService: ChannelUserInternalService,
        private readonly channelMessageReadRepository: ChannelMessageReadRepository,
        private readonly unseenChannelMessageRepository: UnseenChannelMessageRepository,
        private readonly eventPublisher: EventPublisher,
        @InjectConnection() private readonly mongoConnection: Connection,
        private readonly lockService: LockService
    ) {}

    async sendMessage({ payload, client, reqId }: SocketEmit<ChannelSendMessageEmit>): Promise<ChannelSendMessageAck> {
        const { channelId, message } = payload;
        const channel = await this.channelInternalService.findById(channelId);

        if (!channel) {
            throw new ChannelNotFoundException();
        }

        const isInChannel = await this.channelUserService.isInChannel(client._id, channelId);

        if (!isInChannel) {
            throw new UserNotInChannelException();
        }

        const createdMessage = await this.channelMessageRepository.save({
            sender: client._id,
            message,
            channelId
        });

        const messageAck = {
            messageId: createdMessage._id,
            channelId: createdMessage.channelId,
            message: createdMessage.message,
            sender: createdMessage.sender,
            seenCount: createdMessage.seenCount,
            createdAt: createdMessage.createdAt
        };

        this.eventPublisher.publishToBroadcast<ChannelSendMessageBroadcastEvent>(
            ChannelMessageBroadcast.CHANNEL_MESSAGE_SEND,
            {
                client,
                reqId,
                payload: {
                    message: messageAck
                }
            }
        );

        return {
            messageId: createdMessage._id,
            channelId: createdMessage.channelId,
            message: createdMessage.message,
            sender: createdMessage.sender,
            seenCount: createdMessage.seenCount,
            createdAt: createdMessage.createdAt
        };
    }

    async readMessages({ payload, client }: SocketEmit<ChannelMessagesReadEmit>): Promise<ChannelMessagesReadAck> {
        let { messageIds } = payload;
        let lock;
        try {
            lock = await this.lockService.lock(cacheKeys.channel_message_read(client._id), {
                ttl: cacheTTL.lock.channel_message_read,
                noRetry: true
            });
        } catch (err) {
            throw new RaceConditionException(`RaceCond: ${cacheKeys.channel_message_read(client._id)}`);
        }

        const session = await this.mongoConnection.startSession();
        await session.startTransaction();
        try {
            const messagesOfUser = await this.channelMessageRepository.find({
                _id: { $in: messageIds },
                sender: client._id
            });
            const messageIdsBelongsUser = messagesOfUser.map((message) => message._id);
            messageIds = messageIds.filter(function (val) {
                return messageIdsBelongsUser.indexOf(val) == -1;
            });
            await this.channelMessageReadRepository.bulkWrite(
                messageIds.map((messageId) => {
                    return {
                        messageId,
                        userId: client._id
                    };
                })
            );
            await this.unseenChannelMessageRepository.deleteMany(client._id, messageIds);
            for (const messageId of messageIds) {
                const totalMessageReadCount = await this.channelMessageReadRepository.getCount({ messageId });
                await this.channelMessageRepository.updateSeenCount(messageId, totalMessageReadCount);
            }
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            await session.endSession();
            await lock.release();
        }
        return;
    }
}
