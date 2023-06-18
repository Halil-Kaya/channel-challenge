import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../../core/interface/mongo-model/user.interface';
import { hashSync } from 'bcryptjs';

export type UserDocument = UserModel & Document;

@Schema({
    versionKey: false
})
export class UserModel implements User {
    @Prop({ type: MongooseSchema.Types.ObjectId, default: Types.ObjectId })
    _id: string;

    @Prop({ type: String, required: true })
    fullName: string;

    @Prop({ type: String, required: true })
    nickname: string;

    @Prop({ type: String, minlength: 4, maxlength: 24, select: false, required: true })
    password: string;

    @Prop({ type: Date, default: Date.now, required: false })
    createdAt: Date;
}

export enum UserIndexes {
    NICKNAME = 'nickname_index'
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

UserSchema.index({ nickname: 1 }, { background: true, name: UserIndexes.NICKNAME });

function preSave(next: any) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = hashSync(this.password, 12);
    next();
}

function leanObjectId(result) {
    if (result) {
        result._id = result._id.toString();
    }
}

export const UserFactory: AsyncModelFactory = {
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
