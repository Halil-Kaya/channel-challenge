import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChannelMessage, CollectionName } from '../../../core/interface';

export type ChannelMessageDocument = ChannelMessageModel & Document;

@Schema({
    versionKey: false
})
export class ChannelMessageModel implements ChannelMessage {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;
}

export const ChannelMessageSchema = SchemaFactory.createForClass(ChannelMessageModel);

function leanObjectId(result) {
    if (result) {
        result._id = result._id.toString();
    }
}

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
