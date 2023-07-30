import { decrypt, haveUsers, sleep } from '../../common';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { customUsers } from '../../test-setup';
import { BackendOrginated } from '../../../src/core/enum/backend-originated.enum';
import { ChannelJoinedSocketEmitEvent } from '../../../src/core/interface';

it('Should user join channel and joined user should receive channel joined event', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId, name, description, createdAt } = await createChannel(A.client);
    await joinChannel(B.client, {
        channelId
    });
    await Promise.all([
        new Promise<void>((res) => {
            B.client.on(BackendOrginated.CHANNEL_JOINED, (response) => {
                const result = <ChannelJoinedSocketEmitEvent>decrypt(response);
                expect(result.channelId).toBe(channelId);
                expect(result.name).toBe(name);
                expect(result.description).toBe(description);
                expect(result.createdAt.toString()).toBe(createdAt.toString());
                res();
            });
        }),
        new Promise<void>(async (res, rej) => {
            A.client.on(BackendOrginated.CHANNEL_JOINED, () => {
                rej();
            });
            await sleep(250);
            res();
        })
    ]);
});
