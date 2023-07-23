import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelUserDocument, ChannelUserModel } from '../model/channel-user.model';
import { ChannelUser } from '../../../core/interface';

@Injectable()
export class ChannelUserRepository {
    constructor(@InjectModel(ChannelUserModel.name) private readonly channelUserModel: Model<ChannelUserDocument>) {}

    findOneAndUpdate(
        channelId: string,
        payload: Partial<Omit<ChannelUser, '_id' | 'createdAt'>>,
        session?: ClientSession
    ): Promise<ChannelUser> {
        return this.channelUserModel
            .findOneAndUpdate(
                {
                    _id: channelId
                },
                {
                    $set: {
                        ...payload
                    }
                },
                {
                    session,
                    upsert: true,
                    new: true
                }
            )
            .lean()
            .exec();
    }

    isExist(filter: Partial<ChannelUser>) {
        return this.channelUserModel.exists(filter);
    }
}
