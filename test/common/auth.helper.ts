import { testConfig } from '../test-config';
import axios from 'axios';
import { SignInAck, SignInDto } from '../../src/modules/auth/controller/dto';
import { Response } from '../../src/core/interceptor';
import { decrypt, encrypt } from './crypto.helper';

const uri = testConfig.baseUri + 'auth/';

export const signIn = async (dto: SignInDto): Promise<Response<SignInAck>> => {
    const { data } = await axios.post(uri + 'sign-in', encrypt(dto));
    return decrypt(data);
};
