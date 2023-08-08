import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { UnseenChannelMessageDocument, UnseenChannelMessageModel } from '../model';
import { UnseenChannelMessage } from '../../../core/interface';

@Injectable()
export class UnseenChannelMessageRepository {
    constructor(
        @InjectModel(UnseenChannelMessageModel.name)
        private readonly unseenChannelMessageModel: Model<UnseenChannelMessageDocument>
    ) {}

    bulkWrite(unseenChannelMessages: Omit<UnseenChannelMessage, '_id' | 'createdAt'>[], session?: ClientSession) {
        return this.unseenChannelMessageModel.bulkWrite(
            unseenChannelMessages.map((unseenChannelMessage) => {
                return {
                    insertOne: {
                        document: unseenChannelMessage
                    }
                };
            }),
            { ordered: false, session }
        );
    }

    getUnseenMessagesByUserId(userId: string, session?: ClientSession): Promise<UnseenChannelMessage[]> {
        return this.unseenChannelMessageModel
            .find(
                {
                    userId
                },
                {},
                { session }
            )
            .lean()
            .exec();
    }
}
