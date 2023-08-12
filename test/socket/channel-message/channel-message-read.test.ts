import { ChannelMessageMongoModel, haveUsers } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelMessagesRead, channelSendMessage } from '../../common/channel-message.helper';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';

it('should user read channel messages', async () => {
    const [A, B, C] = await haveUsers(3);
    customUsers.push(A, B, C);
    await Promise.all([A.connect(), B.connect(), C.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await Promise.all([joinChannel(B.client, { channelId }), joinChannel(C.client, { channelId })]);
    const messageIds = [];
    for (let i = 0; i < 5; i++) {
        const { messageId } = await channelSendMessage(A.client, {
            channelId,
            message: 'Text message'
        });
        messageIds.push(messageId);
    }
    await channelMessagesRead(B.client, { messageIds, channelId });
    let channelMessages = await ChannelMessageMongoModel.find({
        _id: { $in: messageIds }
    })
        .lean()
        .exec();
    channelMessages.forEach((channelMessage) => {
        expect(channelMessage.seenCount).toBe(1);
    });
    await channelMessagesRead(C.client, { messageIds, channelId });
    channelMessages = await ChannelMessageMongoModel.find({
        _id: { $in: messageIds }
    })
        .lean()
        .exec();
    channelMessages.forEach((channelMessage) => {
        expect(channelMessage.seenCount).toBe(2);
    });
});

it('should throw if user not in channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, { channelId });
    const { messageId } = await channelSendMessage(A.client, {
        channelId,
        message: 'Text message'
    });
    try {
        await channelMessagesRead(B.client, { messageIds: [messageId], channelId });
    } catch (err) {
        const result = <MetaInterface>err;
        expect(result.errorCode).toBe(ErrorCode.USER_NOT_IN_CHANNEL);
    }
});
