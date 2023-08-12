import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, Model } from 'mongoose';
import { ChannelMessageDocument, ChannelMessageIndexes, ChannelMessageModel } from '../model';
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

    find(filter: FilterQuery<ChannelMessage>): Promise<ChannelMessage[]> {
        return this.channelMessageModel.find(filter).lean().exec();
    }

    updateSeenCount(messageId: string, newSeenCount: number, session?: ClientSession) {
        return this.channelMessageModel.updateOne(
            {
                _id: messageId
            },
            {
                $set: {
                    seenCount: newSeenCount
                }
            },
            {
                session
            }
        );
    }

    async paginateMessages(params: {
        channelId: string;
        limit: number;
        prev?: string;
        next?: string;
        around?: string;
    }): Promise<ChannelMessage[]> {
        let { channelId, limit, next, prev, around } = params;
        if (!limit) {
            limit = 10;
        }

        if (around) {
            const [messages1, messages2] = await Promise.all([
                this.paginate({ channelId, _id: { $lt: around } }, { _id: -1 }, Math.floor(limit / 2)),
                this.paginate({ channelId, _id: { $gte: around } }, { _id: 1 }, Math.ceil(limit / 2))
            ]);
            return [...messages1.reverse(), ...messages2];
        }

        const query = {
            channelId
        };
        let sort = { _id: -1 };
        if (next) {
            query['_id'] = {
                $gt: next
            };
            sort = { _id: 1 };
        } else if (prev) {
            query['_id'] = {
                $lt: prev
            };
        }

        return this.paginate(query, sort, limit);
    }

    private paginate(query: FilterQuery<ChannelMessage>, sort: any, limit: number): Promise<ChannelMessage[]> {
        return this.channelMessageModel
            .find(query)
            .hint(ChannelMessageIndexes.CHANNEL_ID)
            .sort(sort)
            .limit(limit)
            .lean()
            .exec();
    }
}
