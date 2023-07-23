import { closeMongoDb, closeRedis, connectMongoDb, connectRedis, resetElasticsearch } from './common';

afterAll(async () => {
    await Promise.all([closeMongoDb(), closeRedis(), resetElasticsearch()]);
});

beforeEach(async () => {
    await Promise.all([connectRedis(), connectMongoDb()]);
});
