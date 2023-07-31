import { Injectable } from '@nestjs/common';
import { ChannelRepository } from '../repository';
import { Channel } from '../../../core/interface';

@Injectable()
export class ChannelInternalService {
    constructor(private readonly channelRepository: ChannelRepository) {}

    findById(channelId: string): Promise<Channel> {
        return this.channelRepository.findById(channelId);
    }
}
