import { decrypt, haveUsers, sleep } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel, leaveChannel } from '../../common/channel.helper';
import { BackendOriginated } from '../../../src/core/enum/backend-originated.enum';
import { ChannelLeftSocketEmitEvent } from '../../../src/core/interface';

it('Should user leave from the channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, {
        channelId
    });
    await leaveChannel(B.client, {
        channelId
    });
    await Promise.all([
        new Promise<void>((res) => {
            B.client.on(BackendOriginated.CHANNEL_LEFT, (response) => {
                const result = <ChannelLeftSocketEmitEvent>decrypt(response);
                expect(result.channelId).toBe(channelId);
                res();
            });
        }),
        new Promise<void>(async (res, rej) => {
            A.client.on(BackendOriginated.CHANNEL_LEFT, () => {
                rej();
            });
            await sleep(250);
            res();
        })
    ]);
});
