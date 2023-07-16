import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChannelUser, ChannelUserStatus, CollectionName } from '../../../core/interface';

export type ChannelUserDocument = ChannelUserModel & Document;

@Schema({
    versionKey: false
})
export class ChannelUserModel implements ChannelUser {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    channelId: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop({ type: String, required: true, enum: ChannelUserStatus })
    status: ChannelUserStatus;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export const ChannelUserSchema = SchemaFactory.createForClass(ChannelUserModel);

function leanObjectId(result) {
    if (result) {
        result._id = result._id.toString();
    }
}

export const ChannelUserFactory: AsyncModelFactory = {
    collection: CollectionName.CHANNEL_USER,
    name: ChannelUserModel.name,
    useFactory: () => {
        ChannelUserSchema.post('find', leanObjectId);
        ChannelUserSchema.post('findOne', leanObjectId);
        ChannelUserSchema.post('findOneAndUpdate', leanObjectId);
        return ChannelUserSchema;
    }
};
