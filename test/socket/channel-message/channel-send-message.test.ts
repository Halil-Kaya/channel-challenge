import { haveUsers } from '../../common';
import { customUsers } from '../../test-setup';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { channelSendMessage } from '../../common/channel-message.helper';

it('user should send message to channel', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId } = await createChannel(A.client);
    await joinChannel(B.client, { channelId });
    const sendedMessageAck = await channelSendMessage(A.client, {
        channelId,
        message: 'Text message'
    });
    expect(sendedMessageAck.messageId).toBeDefined();
    expect(sendedMessageAck.seenCount).toBe(0);
    expect(sendedMessageAck.sender).toBe(A.user._id);
    expect(sendedMessageAck.channelId).toBe(channelId);
    expect(sendedMessageAck.createdAt).toBeDefined();
});
