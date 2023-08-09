import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChannelMessageRead, CollectionName } from '../../../core/interface';
import { leanObjectId, leanObjectsId } from '../../../core/helper';

export type ChannelMessageReadDocument = ChannelMessageReadModel & Document;

@Schema({
    versionKey: false
})
export class ChannelMessageReadModel implements ChannelMessageRead {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    messageId: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum ChannelMessageReadIndexes {
    MESSAGE_ID_USER_ID = 'user_id_message_id_index'
}

export const ChannelMessageReadSchema = SchemaFactory.createForClass(ChannelMessageReadModel);

ChannelMessageReadSchema.index(
    { messageId: 1, userId: 1 },
    { background: true, name: ChannelMessageReadIndexes.MESSAGE_ID_USER_ID }
);

export const ChannelMessageReadFactory: AsyncModelFactory = {
    collection: CollectionName.CHANNEL_MESSAGE_READ,
    name: ChannelMessageReadModel.name,
    useFactory: () => {
        ChannelMessageReadSchema.post('find', leanObjectsId);
        ChannelMessageReadSchema.post('findOne', leanObjectId);
        ChannelMessageReadSchema.post('findOneAndUpdate', leanObjectId);
        return ChannelMessageReadSchema;
    }
};
