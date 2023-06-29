import { testConfig } from '../test-config';
import { UserCreateAck, UserCreateDto } from '../../src/modules/user/dto';
import axios from 'axios';
import { decrypt, encrypt } from './crypto.helper';

const uri = testConfig.baseUri + 'user/';

export const createUser = async (dto?: UserCreateDto): Promise<UserCreateAck> => {
    if (!dto) {
        dto = {
            fullName: '#test-user',
            nickname: Math.random().toString(36).slice(2, 16),
            password: 'passw@rd'
        };
    }
    const { data } = await axios.post(uri, encrypt(dto));
    return decrypt(data);
};
