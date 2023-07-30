import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelMessageDocument, ChannelMessageModel } from '../model/channel-message.model';

@Injectable()
export class ChannelMessageRepository {
    constructor(
        @InjectModel(ChannelMessageModel.name) private readonly channelMessageModel: Model<ChannelMessageDocument>
    ) {}
}
