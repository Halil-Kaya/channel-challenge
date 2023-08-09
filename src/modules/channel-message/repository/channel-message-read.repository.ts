import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { ChannelMessageReadDocument, ChannelMessageReadModel } from '../model';
import { ChannelMessageRead } from '../../../core/interface';

@Injectable()
export class ChannelMessageReadRepository {
    constructor(
        @InjectModel(ChannelMessageReadModel.name)
        private readonly channelMessageReadModel: Model<ChannelMessageReadDocument>
    ) {}

    bulkWrite(channelMessageReads: Omit<ChannelMessageRead, '_id' | 'createdAt'>[], session?: ClientSession) {
        return this.channelMessageReadModel.bulkWrite(
            channelMessageReads.map((channelMessageRead) => {
                return {
                    updateOne: {
                        filter: {
                            messageId: channelMessageRead.messageId,
                            userId: channelMessageRead.userId
                        },
                        update: channelMessageRead,
                        upsert: true
                    }
                };
            }),
            { ordered: false, session }
        );
    }
}
