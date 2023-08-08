import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelMessageDocument, ChannelMessageModel } from '../model';
import { ChannelMessage } from '../../../core/interface';

@Injectable()
export class ChannelMessageRepository {
    constructor(
        @InjectModel(ChannelMessageModel.name) private readonly channelMessageModel: Model<ChannelMessageDocument>
    ) {}

    save(
        channelMessage: Omit<ChannelMessage, '_id' | 'createdAt' | 'seenCount'>,
        session?: ClientSession
    ): Promise<ChannelMessage> {
        const newChannelMessage = new this.channelMessageModel({
            ...channelMessage
        });
        return newChannelMessage.save({ session });
    }

    findByIds(messageIds: string[], session?: ClientSession) {
        return this.channelMessageModel
            .find({ _id: { $in: messageIds } }, {}, { session })
            .sort({ _id: -1 })
            .lean()
            .exec();
    }
}
