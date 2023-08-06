import { Client } from '../client.interface';
import { UserSession } from '../index';
import { ChannelSendMessageAck } from '../../../modules/channel-message/emit';

export interface SocketEmitEvent<T> {
    client: Client;
    reqId: string;
    payload: T;
    userSession: UserSession;
    event: string;
}

export interface SocketFanoutEmitEvent<T> {
    client: Client;
    reqId: string;
    payload: T;
    userSessions: UserSession[];
    event: string;
    channelId: string;
    shouldSenderReceive: boolean;
    senderSession: UserSession;
}

export interface ChannelMessageSocketEmitEvent {
    channelMessage: ChannelSendMessageAck;
}

export interface ChannelJoinedSocketEmitEvent {
    channelId: string;
    name: string;
    description: string;
    createdAt: Date;
}

export interface ChannelLeftSocketEmitEvent {
    channelId: string;
}
