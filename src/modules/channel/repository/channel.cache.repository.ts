import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { Channel, SerializedChannel } from '../../../core/interface';
import { cacheKeys, cacheTTL } from '../../../core/cache';

@Injectable()
export class ChannelCacheRepository {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    async save(channel: Channel): Promise<void> {
        const cacheKey = cacheKeys.channel(channel._id);
        const serializedChannel: SerializedChannel = this.serializeChannel(channel);
        await this.redis.hset(cacheKey, serializedChannel);
        await this.redis.pexpire(cacheKey, cacheTTL.channel.channel);
    }

    async getChannelById(channelId: string): Promise<Channel> {
        const cacheKey = cacheKeys.channel(channelId);
        const channelCache: SerializedChannel = <SerializedChannel>await this.redis.hgetall(cacheKey);
        if (!channelCache) {
            return null;
        }
        return this.deserializeChannel(channelCache);
    }

    serializeChannel(channel: Channel): SerializedChannel {
        return {
            _id: channel._id.toString(),
            name: channel.name,
            description: channel.description,
            owner: channel.owner,
            createdAt: channel.createdAt.toISOString()
        };
    }

    deserializeChannel(serializedChannel: SerializedChannel): Channel {
        return {
            ...serializedChannel,
            _id: serializedChannel._id,
            name: serializedChannel.name,
            owner: serializedChannel.owner,
            description: serializedChannel.description,
            createdAt: new Date(serializedChannel.createdAt)
        };
    }
}
