import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository';
import {
    ChannelCreateAck,
    ChannelCreateEmit,
    ChannelJoinAck,
    ChannelJoinEmit,
    ChannelSearchAck,
    ChannelSearchEmit
} from '../emit';
import { ChannelJoinedBroadcastEvent, ChannelUserRole, ChannelUserStatus, SocketEmit } from '../../../core/interface';
import { ChannelUserInternalService } from '../../channel-user/service/channel-user-internal.service';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { ChannelSearchService } from '../../utils/elastic-search/services/channel-serach.service';
import { ChannelNotFoundException, RaceConditionException } from '../../../core/error';
import { LockService } from '../../../core/service';
import { cacheKeys, cacheTTL } from '../../../core/cache';
import { EventPublisher } from '../../utils/rabbitmq/service/event-publisher';
import { ChannelBroadcast } from '../../../core/enum';

@Injectable()
export class ChannelService {
    constructor(
        private readonly channelRepository: ChannelRepository,
        private readonly channelUserInternalService: ChannelUserInternalService,
        private readonly channelSearchService: ChannelSearchService,
        private readonly lockService: LockService,
        private readonly eventPublisher: EventPublisher,
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
                await this.channelUserInternalService.findOneAndUpdate(channel._id, {
                    channelId: channel._id,
                    userId: channel.owner,
                    role: ChannelUserRole.OWNER,
                    status: ChannelUserStatus.ACTIVE
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

    async join({ payload, client, reqId }: SocketEmit<ChannelJoinEmit>): Promise<ChannelJoinAck> {
        const { channelId } = payload;

        let lock;
        try {
            lock = await this.lockService.lock(cacheKeys.channel_join(payload.channelId, client._id), {
                ttl: cacheTTL.lock.channel_join,
                noRetry: true
            });
        } catch (err) {
            throw new RaceConditionException(`RaceCond: ${cacheKeys.channel_join(payload.channelId, client._id)}`);
        }

        const channel = await this.channelRepository.findById(channelId);
        if (!channel) {
            throw new ChannelNotFoundException();
        }
        const isInChannel = await this.channelUserInternalService.isInChannel(client._id, channelId);
        if (isInChannel) {
            return;
        }

        await this.channelUserInternalService.findOneAndUpdate(channel._id, {
            channelId: channel._id,
            userId: channel.owner,
            role: ChannelUserRole.SUBSCRIBER,
            status: ChannelUserStatus.ACTIVE
        });
        await lock.release();
        this.eventPublisher.publishToBroadcast<ChannelJoinedBroadcastEvent>(ChannelBroadcast.CHANNEL_JOINED, {
            client,
            reqId,
            payload: {
                channel
            }
        });
        return;
    }
}
