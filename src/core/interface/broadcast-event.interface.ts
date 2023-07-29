import { Client } from './client.interface';

export interface BroadcastEvent<T> {
    client: Client;
    reqId: string;
    payload: T;
}
