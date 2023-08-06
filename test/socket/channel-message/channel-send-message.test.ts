import { decrypt, haveUsers, sleep } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelSendMessage } from '../../common/channel-message.helper';
import { BackendOriginated } from '../../../src/core/enum/backend-originated.enum';
import { ChannelMessageSocketEmitEvent } from '../../../src/core/interface';

it('should user send message to channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, { channelId });
    const sentMessageAck = await channelSendMessage(A.client, {
        channelId,
        message: 'Text message'
    });
    expect(sentMessageAck.messageId).toBeDefined();
    expect(sentMessageAck.seenCount).toBe(0);
    expect(sentMessageAck.sender).toBe(A.user._id);
    expect(sentMessageAck.channelId).toBe(channelId);
    expect(sentMessageAck.createdAt).toBeDefined();
});

it('should not receive message event for user who message sent, other users should receive ', async () => {
    const [A, B, C, D, E] = await haveUsers(5);
    customUsers.push(A, B, C, D, E);
    await Promise.all([A.connect(), B.connect(), C.connect(), D.connect(), E.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await Promise.all([
        joinChannel(B.client, { channelId }),
        joinChannel(C.client, { channelId }),
        joinChannel(D.client, { channelId }),
        joinChannel(E.client, { channelId })
    ]);

    await channelSendMessage(A.client, {
        channelId,
        message: 'Text message'
    });

    const ops = [B, C, D, E].map((user) => {
        return new Promise<void>((res, rej) => {
            user.client.on(BackendOriginated.CHANNEL_MESSAGE, (response) => {
                const result = <ChannelMessageSocketEmitEvent>decrypt(response);
                expect(result.channelMessage.channelId).toBe(channelId);
                expect(result.channelMessage.message).toBe('Text message');
                expect(result.channelMessage.sender).toBe(A.user._id);
                expect(result.channelMessage.seenCount).toBe(0);
                expect(result.channelMessage.createdAt).toBeDefined();
                res();
            });
        });
    });

    await Promise.all([
        new Promise<void>(async (res, rej) => {
            A.client.on(BackendOriginated.CHANNEL_MESSAGE, (response) => {
                rej();
            });
            await sleep(200);
            res();
        }),
        ...ops
    ]);
});
