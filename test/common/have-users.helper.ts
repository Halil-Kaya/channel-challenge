import { Socket } from 'socket.io-client';
import { User } from '../../src/core/interface';
import axios from 'axios';
import { testConfig } from '../test-config';
import { decrypt, encrypt } from './crypto.helper';
import { initSocket } from './init-socket';

export type TestUser = {
    client: Socket;
    user: User;
    token: string;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clear: () => void;
};

export const haveUsers = async (count: number): Promise<TestUser[]> => {
    const { data } = await axios.post(testConfig.baseUri + 'dev/have-users', encrypt({ count }));
    const { response } = decrypt(data).result;
    return response.map((item): TestUser => {
        const { user, token } = item;
        const client = initSocket(token);
        return {
            client,
            user,
            token,
            connect: async () => {
                if (client.connected) {
                    return;
                }
                client.connect();
            },
            disconnect: async () => {
                client.disconnect();
            },
            clear: () => {
                client.close();
            }
        };
    });
};
