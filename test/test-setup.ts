import { closeMongoDb, closeRedis, connectMongoDb, connectRedis, resetElasticsearch } from "./common";

afterAll(async () => {
    await Promise.all([closeMongoDb(), closeRedis()]);
});

beforeEach(async () => {
    await Promise.all([connectRedis(), connectMongoDb(), resetElasticsearch()]);
});
