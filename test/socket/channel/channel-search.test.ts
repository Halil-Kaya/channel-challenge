import { haveUsers, sleep } from '../../common';
import { createChannel, searchChannel } from '../../common/channel.helper';

it('Should search channel', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    const channels = await Promise.all([
        createChannel(A.client, { name: 'a aaa a ', description: 'b' }),
        createChannel(A.client, { name: 'a a aa asfasf aa', description: 'b' }),
        createChannel(A.client, { name: 'x a aaa', description: 'bb' }),
        createChannel(A.client, { name: 'x', description: 'bb' }),
        createChannel(A.client, { name: '122', description: 'asdasasdas' }),
        createChannel(A.client, { name: 'qweqwqaqwe', description: 'afsfasfas' })
    ]);
    await sleep(1000);
    const results = await searchChannel(A.client, { text: 'a' });
    expect(results.length).toBe(3);
    results.forEach((result) => {
        const channel = channels.find((channel) => channel._id === result._id);
        expect(channel).not.toBeUndefined();
        expect(result.name).toBe(channel.name);
        expect(result.description).toBe(channel.description);
    });
});
