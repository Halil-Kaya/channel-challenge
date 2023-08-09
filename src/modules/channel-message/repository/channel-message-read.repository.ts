import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelMessageReadDocument, ChannelMessageReadModel } from '../model';

@Injectable()
export class ChannelMessageReadRepository {
    constructor(
        @InjectModel(ChannelMessageReadModel.name)
        private readonly channelMessageReadModel: Model<ChannelMessageReadDocument>
    ) {}
}
