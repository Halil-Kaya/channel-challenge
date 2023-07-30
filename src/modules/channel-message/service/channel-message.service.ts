import { Injectable } from '@nestjs/common';
import { ChannelMessageRepository } from '../repository/channel-message.repository';

@Injectable()
export class ChannelMessageService {
    constructor(private readonly channelMessageRepository: ChannelMessageRepository) {}
}
