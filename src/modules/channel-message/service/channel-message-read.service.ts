import { Injectable } from '@nestjs/common';
import { ChannelMessageReadRepository } from '../repository';

@Injectable()
export class ChannelMessageReadService {
    constructor(private readonly channelMessageReadRepository: ChannelMessageReadRepository) {}
}
