import mongoose, { Model } from 'mongoose';
import { testConfig } from '../../test-config';
import { UserModel, UserSchema } from '../../../src/modules/user/model/user.model';

export const mongoDb = mongoose.connection;

export const connectMongoDb = async (): Promise<void> => {
    await mongoose.connect(testConfig.mongoConnectionUrl);
    await resetMongoDb();
};

export const resetMongoDb = async (): Promise<void> => {
    await Promise.all([mongoDb.collection('user').deleteMany({})]);
};

export const closeMongoDb = async (): Promise<void> => {
    await mongoDb.close();
};

export const UserMongoModel = <Model<UserModel>>mongoDb.model('user', UserSchema, 'user');
