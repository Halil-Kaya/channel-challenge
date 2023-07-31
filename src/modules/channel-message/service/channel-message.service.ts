import { Injectable } from '@nestjs/common';
import { ChannelMessageRepository } from '../repository/channel-message.repository';
import { SocketEmit } from '../../../core/interface';
import { ChannelSendMessageAck, ChannelSendMessageEmit } from '../emit';
import { ChannelInternalService } from '../../channel/service';
import { ChannelNotFoundException, UserNotInChannelException } from '../../../core/error';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';

@Injectable()
export class ChannelMessageService {
    constructor(
        private readonly channelMessageRepository: ChannelMessageRepository,
        private readonly channelInternalService: ChannelInternalService,
        private readonly channelUserService: ChannelUserInternalService
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

        //TODO : message lari kanaldaki kullanicilara gonder

        return {
            messageId: createdMessage._id,
            channelId: createdMessage.channelId,
            message: createdMessage.message,
            sender: createdMessage.sender,
            seenCount: createdMessage.seenCount,
            createdAt: createdMessage.createdAt
        };
    }
}
