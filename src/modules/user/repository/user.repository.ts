import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from '../model/user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
    constructor(@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>) {}
}
