import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository';
import { ChannelCreateAck, ChannelCreateEmit, ChannelSearchAck, ChannelSearchEmit } from '../emit';
import { ChannelUserRole, SocketEmit } from '../../../core/interface';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ChannelSearchService } from '../../utils/elastic-search/services/channel-serach.service';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly channelUserService: ChannelUserInternalService,
        private readonly channelSearchService: ChannelSearchService,
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
        await this.channelSearchService.insert({
            id: channel._id,
            name: channel.name,
            description: channel.description
        });
        return {
            _id: channel._id,
            name: channel.name,
            description: channel.description,
            owner: channel.owner,
            createdAt: channel.createdAt
        };
    }

    async search({ payload }: SocketEmit<ChannelSearchEmit>): Promise<ChannelSearchAck[]> {
        const results = await this.channelSearchService.search(payload.text);
        return results.map((result) => {
            return {
                _id: result.id,
                name: result.name,
                description: result.description
            };
        });
    }
}
