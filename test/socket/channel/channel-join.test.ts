import { haveUsers, sleep } from '../../common';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { customUsers } from '../../test-setup';

it('Should user join channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, {
        channelId
    });

    await sleep(3000);
});
