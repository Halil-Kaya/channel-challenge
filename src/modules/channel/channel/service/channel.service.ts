import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository';
import { ChannelCreateAck, ChannelCreateEmit } from '../emit';
import { SocketEmit } from '../../../../core/interface';

@Injectable()
export class ChannelService {
    constructor(private readonly channelRepository: ChannelRepository) {}

    async save({ payload, client }: SocketEmit<ChannelCreateEmit>): Promise<ChannelCreateAck> {
        const channel = await this.channelRepository.save({
            ...payload,
            owner: client._id.toString()
        });
        return {
            _id: channel._id,
            name: channel.name,
            description: channel.description,
            owner: channel.owner,
            createdAt: channel.createdAt
        };
    }
}
