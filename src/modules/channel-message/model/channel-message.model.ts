import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChannelMessage, CollectionName } from '../../../core/interface';
import { leanObjectId } from '../../../core/helper';

export type ChannelMessageDocument = ChannelMessageModel & Document;

@Schema({
    versionKey: false
})
export class ChannelMessageModel implements ChannelMessage {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    channelId: string;

    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: String, required: true })
    sender: string;

    @Prop({ type: Number, default: 0 })
    seenCount: number;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum ChannelMessageIndexes {
    CHANNEL_ID = 'channel_id_index'
}

export const ChannelMessageSchema = SchemaFactory.createForClass(ChannelMessageModel);

ChannelMessageSchema.index({ channelId: 1 }, { background: true, name: ChannelMessageIndexes.CHANNEL_ID });

export const ChannelMessageFactory: AsyncModelFactory = {
    collection: CollectionName.CHANNEL,
    name: ChannelMessageModel.name,
    useFactory: () => {
        ChannelMessageSchema.post('find', leanObjectId);
        ChannelMessageSchema.post('findOne', leanObjectId);
        ChannelMessageSchema.post('findOneAndUpdate', leanObjectId);
        return ChannelMessageSchema;
    }
};
