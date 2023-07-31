import { Socket } from 'socket.io-client';
import { ChannelSendMessageAck, ChannelSendMessageEmit } from '../../src/modules/channel-message/emit';
import { ChannelMessageGatewayEvent } from '../../src/core/enum';
import { decrypt, encrypt } from './crypto.helper';

export const channelSendMessage = async (
    client: Socket,
    dto: ChannelSendMessageEmit
): Promise<ChannelSendMessageAck> => {
    return new Promise((res, rej) => {
        client.emit(ChannelMessageGatewayEvent.CHANNEL_SEND_MESSAGE, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};
