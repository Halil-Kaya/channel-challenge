import { cacheKeys } from '../../../src/core/cache';
import { getRedis, haveUsers, sleep } from '../../common';
import { UserSession } from '../../../src/core/interface';

it('Should user connect and disconnect socket', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    await sleep(1000);
    const redis = await getRedis();
    const sessionInRedis: UserSession = <UserSession>await redis.hGetAll(cacheKeys.session_user(A.user._id));
    expect(sessionInRedis.userId).toBe(A.user._id);
    expect(sessionInRedis.nickname).toBe(A.user.nickname);
    expect(sessionInRedis.nodeId).toBeTruthy();
    await A.disconnect();
    await sleep(1000);
    const exist = await redis.exists(cacheKeys.session_user(A.user._id));
    expect(exist).toBe(0);
});
