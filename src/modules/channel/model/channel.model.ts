import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Channel, CollectionName } from '../../../core/interface';
import { leanObjectId, leanObjectsId } from "../../../core/helper";

export type ChannelDocument = ChannelModel & Document;

@Schema({
    versionKey: false
})
export class ChannelModel implements Channel {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    owner: string;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export const ChannelSchema = SchemaFactory.createForClass(ChannelModel);

export const ChannelFactory: AsyncModelFactory = {
    collection: CollectionName.CHANNEL,
    name: ChannelModel.name,
    useFactory: () => {
        ChannelSchema.post('find', leanObjectsId);
        ChannelSchema.post('findOne', leanObjectId);
        ChannelSchema.post('findOneAndUpdate', leanObjectId);
        return ChannelSchema;
    }
};
