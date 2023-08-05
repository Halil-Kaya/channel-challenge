import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelUserDocument, ChannelUserModel } from '../model/channel-user.model';
import { ChannelUser } from '../../../core/interface';

@Injectable()
export class ChannelUserRepository {
    constructor(@InjectModel(ChannelUserModel.name) private readonly channelUserModel: Model<ChannelUserDocument>) {}

    findOneAndUpdate(
        filter: Partial<ChannelUser>,
        payload: Partial<Omit<ChannelUser, '_id' | 'createdAt'>>,
        session?: ClientSession
    ): Promise<ChannelUser> {
        return this.channelUserModel
            .findOneAndUpdate(
                {
                    ...filter
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

    getUsersOfChannel(channelId: string, excludedIds: string[] = []): Promise<ChannelUser[]> {
        return this.channelUserModel.find({ channelId, $nin: excludedIds }).lean().exec();
    }
}
