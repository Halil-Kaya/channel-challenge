import { closeMongoDb, closeRedis, connectMongoDb, connectRedis } from './common/db';

afterAll(async () => {
    await Promise.all([closeMongoDb(), closeRedis()]);
});

beforeEach(async () => {
    await Promise.all([connectRedis(), connectMongoDb()]);
});
