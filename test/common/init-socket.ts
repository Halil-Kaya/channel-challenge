import { io, Socket } from 'socket.io-client';
import { testConfig } from '../test-config';

const opts = {
    reconnection: true,
    autoConnect: false
};

export const initSocket = (token: string): Socket => {
    return io(testConfig.baseUri, { ...opts, query: { token } });
};
