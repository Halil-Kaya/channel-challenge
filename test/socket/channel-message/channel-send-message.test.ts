import { decrypt, haveUsers, sleep, UnseenChannelMessageMongoModel } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelSendMessage } from '../../common/channel-message.helper';
import { BackendOriginated } from '../../../src/core/enum/backend-originated.enum';
import { ChannelMessageSocketEmitEvent, UnseenChannelMessagesSocketEmitEvent } from '../../../src/core/interface';

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
        return new Promise<void>((res) => {
            user.client.once(BackendOriginated.CHANNEL_MESSAGE, (response) => {
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
            A.client.once(BackendOriginated.CHANNEL_MESSAGE, () => {
                rej();
            });
            await sleep(200);
            res();
        }),
        ...ops
    ]);
});

it('should not receive message event for user who message sent, other users should receive event through disconnect and connect again', async () => {
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

    await sleep(500);

    await Promise.all([A.disconnect(), B.disconnect(), C.disconnect(), D.disconnect(), E.disconnect()]);

    await sleep(100);

    await Promise.all([
        A.client.connect(),
        B.client.connect(),
        C.client.connect(),
        D.client.connect(),
        E.client.connect()
    ]);

    await sleep(100);

    await channelSendMessage(A.client, {
        channelId,
        message: 'Text message'
    });

    const ops = [B, C, D, E].map((user) => {
        return new Promise<void>((res) => {
            user.client.once(BackendOriginated.CHANNEL_MESSAGE, (response) => {
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
            A.client.once(BackendOriginated.CHANNEL_MESSAGE, () => {
                rej();
            });
            await sleep(200);
            res();
        }),
        ...ops
    ]);
});

it('Should save messages for offline users', async () => {
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
    await sleep(100);
    await Promise.all([D.disconnect(), E.disconnect()]);

    const opsForOfflines = [B, D, E].map((user) => {
        return new Promise<void>(async (res, rej) => {
            user.client.on(BackendOriginated.CHANNEL_MESSAGE, () => {
                rej();
            });
            await sleep(100);
            res();
        });
    });

    const offlineUserIds = [D, E].map((user) => user.user._id);

    const opsForOnlines = [A, C].map((user) => {
        return new Promise<void>((res) => {
            user.client.once(BackendOriginated.CHANNEL_MESSAGE, (response) => {
                const result = <ChannelMessageSocketEmitEvent>decrypt(response);
                expect(result.channelMessage.channelId).toBe(channelId);
                expect(result.channelMessage.message).toBe('HEY');
                expect(result.channelMessage.sender).toBe(B.user._id);
                expect(result.channelMessage.seenCount).toBe(0);
                expect(result.channelMessage.createdAt).toBeDefined();
                res();
            });
        });
    });

    const [message] = await Promise.all([
        channelSendMessage(B.client, {
            channelId,
            message: 'HEY'
        }),
        ...opsForOfflines,
        ...opsForOnlines
    ]);

    const result = await Promise.all(
        offlineUserIds.map((offlineUserId) => {
            return UnseenChannelMessageMongoModel.exists({
                userId: offlineUserId,
                messageId: message.messageId
            })
                .lean()
                .exec();
        })
    );
    expect(result.every((r) => !!r)).toBeTruthy();
    const count = await UnseenChannelMessageMongoModel.count({
        messageId: message.messageId
    });
    expect(count).toBe(2);
});

it('should offline users receive messages after be online', async () => {
    const [A, B, C] = await haveUsers(5);
    customUsers.push(A, B, C);
    await Promise.all([A.connect(), B.connect(), C.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await Promise.all([joinChannel(B.client, { channelId }), joinChannel(C.client, { channelId })]);
    await sleep(50);
    await Promise.all([B.disconnect(), C.disconnect()]);
    await sleep(50);
    for (let i = 0; i < 5; i++) {
        await channelSendMessage(A.client, {
            channelId,
            message: `Message#${i}`
        });
    }
    await sleep(50);

    await Promise.all([
        B.connect(),
        C.connect(),
        ...[B, C].map((testUser) => {
            return new Promise<void>((res) => {
                testUser.client.on(BackendOriginated.UNSEEN_CHANNEL_MESSAGES, (response) => {
                    const result = <UnseenChannelMessagesSocketEmitEvent>decrypt(response);
                    let messageSortNumber = 0;
                    expect(result.unseenChannelMessages.length).toBe(5);
                    for (const channelMessage of result.unseenChannelMessages) {
                        expect(channelMessage.channelId).toBe(channelId);
                        expect(channelMessage.message.includes(`Message#${4 - messageSortNumber}`)).toBeTruthy();
                        expect(channelMessage.sender).toBe(A.user._id);
                        expect(channelMessage.seenCount).toBe(0);
                        expect(channelMessage.createdAt).toBeDefined();
                        messageSortNumber++;
                    }
                    res();
                });
            });
        })
    ]);
});
