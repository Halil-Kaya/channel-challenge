import { Client } from '../client.interface';
import { UserSession } from '../index';

export interface SocketEmitEvent<T> {
    client: Client;
    reqId: string;
    payload: T;
    userSession: UserSession;
    event: string;
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
