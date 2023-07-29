import { haveUsers } from '../../common';
import { createChannel, joinChannel } from '../../common/channel.helper';

it('Should user join channel', async () => {
    const [A, B] = await haveUsers(2);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, {
        channelId
    });
});
