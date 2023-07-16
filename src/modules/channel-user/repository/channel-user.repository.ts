import { Injectable } from '@nestjs/common';
import { ChannelUserCreateAck, ChannelUserCreateEmit } from '../emit';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelUserDocument, ChannelUserModel } from '../model/channel-user.model';

@Injectable()
export class ChannelUserRepository {
    constructor(@InjectModel(ChannelUserModel.name) private readonly channelUserModel: Model<ChannelUserDocument>) {}

    async save(dto: ChannelUserCreateAck, session?: ClientSession): Promise<ChannelUserCreateEmit> {
        const newChannelUser = new this.channelUserModel({
            ...dto
        });
        await newChannelUser.save({ session });
        return;
    }
}
