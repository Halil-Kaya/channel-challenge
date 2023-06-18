import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from '../model/user.model';
import { ClientSession, Model } from 'mongoose';
import { User } from '../../../core/interface/mongo-model/user.interface';

@Injectable()
export class UserMongoRepository {
    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>) {}

    save(user: Omit<User, '_id' | 'createdAt'>, session?: ClientSession) {
        const newUser = new this.userModel(user);
        return newUser.save({ session });
    }

    findById(_id: string): Promise<UserDocument> {
        return this.userModel.findById(_id).lean().exec();
    }

    findByNickname(nickname: string): Promise<UserDocument> {
        return this.userModel
            .findOne({
                nickname
            })
            .lean()
            .exec();
    }

    updatePassword(userId: string, newPassword, session?: ClientSession): Promise<UserDocument> {
        return this.userModel
            .findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    $set: {
                        password: newPassword
                    }
                },
                {
                    session,
                    lean: true,
                    new: false,
                    upsert: true
                }
            )
            .exec();
    }
}
