import { Injectable } from '@nestjs/common';
import { ChannelUserRepository } from '../repository/channel-user.repository';
import { ChannelUserCreateAck, ChannelUserCreateEmit } from '../emit';

@Injectable()
export class ChannelUserInternalService {
    constructor(private readonly channelUserRepository: ChannelUserRepository) {}

    save(dto: ChannelUserCreateEmit): Promise<ChannelUserCreateAck> {
        return this.channelUserRepository.save(dto);
    }
}
