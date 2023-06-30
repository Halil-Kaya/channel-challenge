import { io, Socket } from 'socket.io-client';
import { testConfig } from '../test-config';
import { encrypt } from './crypto.helper';

const opts = {
    transports: ['websocket'],
    reconnection: true,
    autoConnect: false
};

export const initSocket = (token: string): Socket => {
    return io(testConfig.baseUri, { ...opts, query: encrypt({ token }) });
};
