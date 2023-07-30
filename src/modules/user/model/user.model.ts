import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CollectionName, User } from '../../../core/interface';
import { leanObjectId, preSave } from '../../../core/helper';

export type UserDocument = UserModel & Document;

@Schema({
    versionKey: false
})
export class UserModel implements User {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, default: Types.ObjectId })
    public _id: string;

    @Prop({ type: String, required: true })
    fullName: string;

    @Prop({ type: String, unique: true, required: true })
    nickname: string;

    @Prop({ type: String, select: false, minlength: 4, maxlength: 24, required: true })
    password: string;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum UserIndexes {
    NICKNAME = 'nickname_index'
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.index({ nickname: 1 }, { background: true, name: UserIndexes.NICKNAME });

export const UserFactory: AsyncModelFactory = {
    collection: CollectionName.USER,
    name: UserModel.name,
    useFactory: () => {
        UserSchema.pre('save', preSave);
        UserSchema.post('find', leanObjectId);
        UserSchema.post('findOne', leanObjectId);
        UserSchema.post('findOneAndUpdate', preSave);
        UserSchema.post('findOneAndUpdate', leanObjectId);
        return UserSchema;
    }
};
