import { Injectable } from '@nestjs/common';
import { ChannelMessageRepository } from '../repository';
import { ChannelMessage } from '../../../core/interface';
import { ClientSession } from 'mongoose';

@Injectable()
export class ChannelMessageInternalService {
    constructor(private readonly channelMessageRepository: ChannelMessageRepository) {}

    getMessagesByIds(messageIds: string[], session?: ClientSession): Promise<ChannelMessage[]> {
        return this.channelMessageRepository.findByIds(messageIds,session);
    }
}
