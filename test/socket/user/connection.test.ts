import { cacheKeys } from '../../../src/core/cache';
import { getRedis, haveUsers, sleep } from '../../common';

it('Should user connect and disconnect socket', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    await sleep(1000);
    const redis = await getRedis();
    const sessionInRedis = await redis.hGet(cacheKeys.session_user, A.user._id);
    expect(sessionInRedis).toBe(A.user.nickname);
    await A.disconnect();
    await sleep(1000);
    const exist = await redis.hExists(cacheKeys.session_user, A.user._id);
    expect(exist).toBe(false);
});
