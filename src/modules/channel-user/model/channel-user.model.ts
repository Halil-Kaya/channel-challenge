import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChannelUser, ChannelUserRole, ChannelUserStatus, CollectionName } from '../../../core/interface';

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

    @Prop({ type: String, required: true, enum: ChannelUserRole })
    role: ChannelUserRole;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum ChannelUserIndexes {
    CHANNEL_ID_USER_ID_ROLE_STATUS = 'channel_id_user_id_role_status_index',
    CHANNEL_ID_STATUS = 'channel_id_status_index'
}

export const ChannelUserSchema = SchemaFactory.createForClass(ChannelUserModel);

ChannelUserSchema.index(
    { channelId: 1, userId: 1, role: 1, status: 1 },
    { background: true, name: ChannelUserIndexes.CHANNEL_ID_USER_ID_ROLE_STATUS }
);
ChannelUserSchema.index({ channelId: 1, status: 1 }, { background: true, name: ChannelUserIndexes.CHANNEL_ID_STATUS });

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
