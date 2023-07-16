import mongoose, { Model } from 'mongoose';
import { testConfig } from '../../test-config';
import { UserModel, UserSchema } from '../../../src/modules/user/model/user.model';
import { CollectionName } from '../../../src/core/interface';

export const mongoDb = mongoose.connection;

export const connectMongoDb = async (): Promise<void> => {
    await mongoose.connect(testConfig.mongoConnectionUrl);
    await resetMongoDb();
};

export const resetMongoDb = async (): Promise<void> => {
    const ops = [];
    for (let key in CollectionName) {
        ops.push(mongoDb.collection(CollectionName[key]).deleteMany({}));
    }
    await Promise.all(ops);
};

export const closeMongoDb = async (): Promise<void> => {
    await mongoDb.close();
};

export const UserMongoModel = <Model<UserModel>>mongoDb.model('user', UserSchema, 'user');
