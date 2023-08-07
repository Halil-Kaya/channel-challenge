import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollectionName, UnseenChannelMessage } from '../../../core/interface';
import { leanObjectId, leanObjectsId } from '../../../core/helper';

export type UnseenChannelMessageDocument = UnseenChannelMessageModel & Document;

@Schema({
    versionKey: false
})
export class UnseenChannelMessageModel implements UnseenChannelMessage {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    messageId: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum UnseenChannelMessageIndexes {
    MESSAGE_ID_USER_ID = 'message_id_user_id_index'
}

export const UnseenChannelMessageSchema = SchemaFactory.createForClass(UnseenChannelMessageModel);

UnseenChannelMessageSchema.index(
    { messageId: 1, userId: 1 },
    { background: true, name: UnseenChannelMessageIndexes.MESSAGE_ID_USER_ID }
);

export const UnseenChannelMessageFactory: AsyncModelFactory = {
    collection: CollectionName.UNSEEN_CHANNEL_MESSAGE,
    name: UnseenChannelMessageModel.name,
    useFactory: () => {
        UnseenChannelMessageSchema.post('find', leanObjectsId);
        UnseenChannelMessageSchema.post('findOne', leanObjectId);
        UnseenChannelMessageSchema.post('findOneAndUpdate', leanObjectId);
        return UnseenChannelMessageSchema;
    }
};
