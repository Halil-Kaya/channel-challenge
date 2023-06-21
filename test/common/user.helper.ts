import { testConfig } from '../test-config';
import { UserCreateDto } from '../../src/modules/user/controller/dto';
import axios from 'axios';
import { AxiosResponse } from "axios";

const uri = testConfig.baseUri + 'user/';

export const createUser = (dto?: UserCreateDto): Promise<AxiosResponse<void>> => {
    if (!dto) {
        dto = {
            fullName: '#test-user',
            nickname: Math.random().toString(36).slice(2, 16),
            password: 'passw@rd'
        };
    }
    return axios.post(uri, dto);
};
