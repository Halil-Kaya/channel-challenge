import mongoose from 'mongoose';
import { testConfig } from '../../test-config';

export const mongoDb = mongoose.connection;

export const connectMongoDb = async (): Promise<void> => {
    await mongoose.connect(testConfig.mongoConnectionUrl);
    await resetMongoDb();
};

export const resetMongoDb = async (): Promise<void> => {
    await Promise.all([mongoDb.collection('users').deleteMany({})]);
};

export const closeMongoDb = async (): Promise<void> => {
    await mongoDb.close();
};
