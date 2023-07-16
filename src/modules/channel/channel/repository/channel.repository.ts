import { Injectable } from '@nestjs/common';
import { ChannelCacheRepository } from './channel.cache.repository';
import { ChannelMongoRepository } from './channel.mongo.repository';
import { Channel } from '../../../../core/interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class ChannelRepository {
    constructor(
        private readonly channelCacheRepository: ChannelCacheRepository,
        private readonly channelMongoRepository: ChannelMongoRepository
    ) {}

    async save(channel: Omit<Channel, '_id' | 'createdAt'>, session?: ClientSession): Promise<Channel> {
        const createdChannel = await this.channelMongoRepository.save(channel, session);
        await this.channelCacheRepository.save(createdChannel);
        return createdChannel;
    }
}
