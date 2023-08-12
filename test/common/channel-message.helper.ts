import { Socket } from 'socket.io-client';
import {
    ChannelMessagesGetAck,
    ChannelMessagesGetEmit,
    ChannelMessagesReadAck,
    ChannelMessagesReadEmit,
    ChannelSendMessageAck,
    ChannelSendMessageEmit
} from '../../src/modules/channel-message/emit';
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

export const channelMessagesRead = async (
    client: Socket,
    dto: ChannelMessagesReadEmit
): Promise<ChannelMessagesReadAck> => {
    return new Promise((res, rej) => {
        client.emit(ChannelMessageGatewayEvent.CHANNEL_MESSAGES_READ, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};

export const channelGetMessages = async (
    client: Socket,
    dto: ChannelMessagesGetEmit
): Promise<ChannelMessagesGetAck> => {
    return new Promise((res, rej) => {
        client.emit(ChannelMessageGatewayEvent.CHANNEL_MESSAGES_GET, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};
