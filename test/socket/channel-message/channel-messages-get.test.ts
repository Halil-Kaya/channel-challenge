import { ChannelMessageMongoModel, haveUsers, sleep } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelGetMessages, channelSendMessage } from '../../common/channel-message.helper';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';

it('should user send message to channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, { channelId });
    await sleep(50);
    for (let i = 0; i < 150; i++) {
        const rnd = Math.round(Math.random());
        await channelSendMessage([A.client, B.client][rnd], {
            channelId,
            message: 'Text message#' + (i + 1)
        });
    }
    await sleep(400);

    const testForNext = async () => {
        const channelMessagesAck = await channelGetMessages(B.client, { channelId, limit: 10 });
        expect(channelMessagesAck.messages.length).toBe(10);
        const channelMessages = channelMessagesAck.messages;
        channelMessages.map((channelMessage, index) => {
            expect(channelMessage.channelId).toBe(channelId);
            expect(channelMessage.message).toBe('Text message#' + (150 - index));
        });
    };

    const testForPrev = async () => {
        const randomChannelMessage = await ChannelMessageMongoModel.findOne({}).skip(50).lean().exec();
        const channelMessagesAck = await channelGetMessages(B.client, {
            channelId,
            limit: 10,
            next: randomChannelMessage._id.toString()
        });
        const channelMessages = channelMessagesAck.messages;
        channelMessages.map((channelMessage, index) => {
            expect(channelMessage.channelId).toBe(channelId);
            expect(channelMessage.message).toBe('Text message#' + (52 + index));
        });
    };

    const testForAround = async () => {
        const randomChannelMessage = await ChannelMessageMongoModel.findOne({}).skip(75).lean().exec();
        const channelMessagesAck = await channelGetMessages(B.client, {
            channelId,
            limit: 10,
            around: randomChannelMessage._id.toString()
        });
        const channelMessages = channelMessagesAck.messages;
        channelMessages.map((channelMessage, index) => {
            expect(channelMessage.channelId).toBe(channelId);
            expect(channelMessage.message).toBe('Text message#' + (71 + index));
        });
    };

    await Promise.all([testForNext(), testForPrev(), testForAround()]);
});

it('should throw error if user not in channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await channelSendMessage(A.client, {
        channelId,
        message: 'Text message#'
    });
    try {
        await channelGetMessages(B.client, { channelId, limit: 10 });
    } catch (err) {
        const result = <MetaInterface>err;
        expect(result.errorCode).toBe(ErrorCode.USER_NOT_IN_CHANNEL);
    }
});
