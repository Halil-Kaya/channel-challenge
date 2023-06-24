import { testConfig } from '../test-config';
import axios, { AxiosResponse } from 'axios';
import { SignInAck, SignInDto } from '../../src/modules/auth/controller/dto';
import { Response } from '../../src/core/interceptor';

const uri = testConfig.baseUri + 'auth/';

export const signIn = (dto: SignInDto): Promise<AxiosResponse<Response<SignInAck>>> => {
    return axios.post(uri + 'sign-in', dto);
};
