import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository';
import { ChannelCreateAck, ChannelCreateEmit } from '../emit';
import { ChannelUserRole, SocketEmit } from '../../../core/interface';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly channelUserService: ChannelUserInternalService,
        @InjectConnection() private readonly mongoConnection: Connection
    ) {}

    async save({ payload, client }: SocketEmit<ChannelCreateEmit>): Promise<ChannelCreateAck> {
        const session = await this.mongoConnection.startSession();
        let channel;
        await session.withTransaction(
            async () => {
                channel = await this.channelRepository.save({
                    ...payload,
                    owner: client._id.toString()
                });

                await this.channelUserService.save({
                    channelId: channel._id,
                    userId: channel.owner,
                    role: ChannelUserRole.OWNER
                });
            },
            { retryWrites: true }
        );
        return {
            _id: channel._id,
            name: channel.name,
            description: channel.description,
            owner: channel.owner,
            createdAt: channel.createdAt
        };
    }
}
