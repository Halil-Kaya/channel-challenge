import mongoose, { Model } from 'mongoose';
import { testConfig } from '../../test-config';
import { UserModel, UserSchema } from '../../../src/modules/user/model/user.model';
import { ChannelUser, CollectionName } from '../../../src/core/interface';
import { ChannelUserSchema } from '../../../src/modules/channel-user/model/channel-user.model';
import { ChannelModel, ChannelSchema } from '../../../src/modules/channel/model/channel.model';

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
export const ChannelMongoModel = <Model<ChannelModel>>mongoDb.model('channel', ChannelSchema, 'channel');
export const ChannelUserMongoModel = <Model<ChannelUser>>(
    mongoDb.model('channel_user', ChannelUserSchema, 'channel_user')
);
