import { Socket } from 'socket.io-client';
import {
    ChannelCreateAck,
    ChannelCreateEmit,
    ChannelJoinAck,
    ChannelJoinEmit,
    ChannelLeaveAck,
    ChannelLeaveEmit,
    ChannelSearchAck,
    ChannelSearchEmit
} from '../../src/modules/channel/emit';
import { getRandomNumber } from './helper';
import { ChannelGatewayEvent } from '../../src/core/enum';
import { decrypt, encrypt } from './crypto.helper';

export const createChannel = async (client: Socket, dto?: ChannelCreateEmit): Promise<ChannelCreateAck> => {
    const rnd = getRandomNumber(1, 100);
    if (!dto) {
        dto = {
            name: 'Test Channel Name#' + rnd,
            description: 'Test Channel Description#' + rnd
        };
    }
    return new Promise((res, rej) => {
        client.emit(ChannelGatewayEvent.CHANNEL_CREATE, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};

export const searchChannel = async (client: Socket, dto: ChannelSearchEmit): Promise<ChannelSearchAck[]> => {
    return new Promise((res, rej) => {
        client.emit(ChannelGatewayEvent.CHANNEL_SEARCH, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};

export const joinChannel = async (client: Socket, dto: ChannelJoinEmit): Promise<ChannelJoinAck> => {
    return new Promise((res, rej) => {
        client.emit(ChannelGatewayEvent.CHANNEL_JOIN, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};

export const leaveChannel = async (client: Socket, dto: ChannelLeaveEmit): Promise<ChannelLeaveAck> => {
    return new Promise((res, rej) => {
        client.emit(ChannelGatewayEvent.CHANNEL_LEAVE, encrypt(dto), (error, response) => {
            if (error) {
                rej(decrypt(error));
            }
            res(decrypt(response));
        });
    });
};
