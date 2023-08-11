import { ChannelMessageMongoModel, haveUsers } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelMessagesRead, channelSendMessage } from '../../common/channel-message.helper';

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
    await channelMessagesRead(B.client, { messageIds });
    let channelMessages = await ChannelMessageMongoModel.find({
        _id: { $in: messageIds }
    })
        .lean()
        .exec();
    channelMessages.forEach((channelMessage) => {
        expect(channelMessage.seenCount).toBe(1);
    });
    await channelMessagesRead(C.client, { messageIds });
    channelMessages = await ChannelMessageMongoModel.find({
        _id: { $in: messageIds }
    })
        .lean()
        .exec();
    channelMessages.forEach((channelMessage) => {
        expect(channelMessage.seenCount).toBe(2);
    });
});
