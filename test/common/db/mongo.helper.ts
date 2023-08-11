import mongoose, { Model } from 'mongoose';
import { testConfig } from '../../test-config';
import { UserModel, UserSchema } from '../../../src/modules/user/model/user.model';
import { CollectionName } from '../../../src/core/interface';
import { ChannelUserModel, ChannelUserSchema } from '../../../src/modules/channel-user/model/channel-user.model';
import { ChannelModel, ChannelSchema } from '../../../src/modules/channel/model/channel.model';
import {
    ChannelMessageModel,
    ChannelMessageSchema,
    UnseenChannelMessageModel,
    UnseenChannelMessageSchema
} from '../../../src/modules/channel-message/model';

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

export const UserMongoModel = <Model<UserModel>>mongoDb.model(UserModel.name, UserSchema, CollectionName.USER);
export const ChannelMongoModel = <Model<ChannelModel>>(
    mongoDb.model(ChannelModel.name, ChannelSchema, CollectionName.CHANNEL)
);
export const ChannelUserMongoModel = <Model<ChannelUserModel>>(
    mongoDb.model(ChannelUserModel.name, ChannelUserSchema, CollectionName.CHANNEL_USER)
);
export const UnseenChannelMessageMongoModel = <Model<UnseenChannelMessageModel>>(
    mongoDb.model(UnseenChannelMessageModel.name, UnseenChannelMessageSchema, CollectionName.UNSEEN_CHANNEL_MESSAGE)
);
export const ChannelMessageMongoModel = <Model<ChannelMessageModel>>(
    mongoDb.model(ChannelMessageModel.name, ChannelMessageSchema, CollectionName.CHANNEL_MESSAGE)
);
