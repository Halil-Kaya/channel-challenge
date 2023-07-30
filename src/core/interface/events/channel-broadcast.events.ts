import { Channel } from '../index';
import { Client } from '../client.interface';

export interface BroadcastEvent<T> {
    client: Client;
    reqId: string;
    payload: T;
}

export interface ChannelJoinedBroadcastEvent {
    channel: Channel;
}
