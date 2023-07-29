import { closeMongoDb, closeRedis, connectMongoDb, connectRedis, resetElasticsearch } from './common';

export const customUsers = [];

afterAll(async () => {
    await Promise.all([closeMongoDb(), closeRedis(), resetElasticsearch(), customUsers.map((user) => user.clear())]);
});

beforeEach(async () => {
    await Promise.all([connectRedis(), connectMongoDb()]);
});
