import { Client } from './client.interface';

export interface SocketEmit<T> {
    client: Client;
    reqId: string;
    payload: T;
}
