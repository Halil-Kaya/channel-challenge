import { Injectable } from '@nestjs/common';
import { ChannelUserRepository } from '../repository/channel-user.repository';

@Injectable()
export class ChannelUserInternalService {
    constructor(private readonly channelUserRepository: ChannelUserRepository) {}
}
