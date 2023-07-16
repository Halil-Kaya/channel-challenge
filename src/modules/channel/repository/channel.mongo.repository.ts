import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelDocument, ChannelModel } from '../model/channel.model';
import { Channel } from '../../../core/interface';

@Injectable()
export class ChannelMongoRepository {
    constructor(@InjectModel(ChannelModel.name) private readonly channelModel: Model<ChannelDocument>) {}

    save(channel: Omit<Channel, '_id' | 'createdAt'>, session?: ClientSession) {
        const newChannel = new this.channelModel({
            ...channel
        });
        return newChannel.save({ session });
    }

    findById(_id: string): Promise<Channel> {
        return this.channelModel.findById(_id).lean().exec();
    }

    update(_id: string, data: Omit<Channel, '_id' | 'createdAt'>, session?: ClientSession) {
        return this.channelModel
            .findOneAndUpdate(
                {
                    _id
                },
                {
                    $set: {
                        ...data
                    }
                },
                {
                    lean: true,
                    upsert: true,
                    session
                }
            )
            .exec();
    }
}
