import { createUser } from '../../common/user.helper';
import { UserCreateDto } from '../../../src/modules/user/dto';
import { signIn } from '../../common/auth.helper';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';

it('Should sign-in user', async () => {
    const dto: UserCreateDto = {
        nickname: 'hlkroot',
        fullName: 'Halil Kaya',
        password: '12345678'
    };
    await createUser(dto);
    const { data } = await signIn({ nickname: dto.nickname, password: dto.password });
    const { accessToken } = data.result;
    expect(accessToken).toBeDefined();
});

it('Should not get access token if password is wrong', async () => {
    const dto: UserCreateDto = {
        nickname: 'hlkroot',
        fullName: 'Halil Kaya',
        password: '12345678'
    };
    await createUser(dto);
    try {
        await signIn({ nickname: dto.nickname, password: 'wrong-password' });
    } catch (err) {
        const result = <MetaInterface>err.response.data.meta;
        expect(result.errorCode).toBe(ErrorCode.UNAUTHORIZED);
    }
});

it('Should not get access token if username is wrong', async () => {
    const dto: UserCreateDto = {
        nickname: 'hlkroot',
        fullName: 'Halil Kaya',
        password: '12345678'
    };
    await createUser(dto);
    try {
        await signIn({ nickname: 'wrong-nickname', password: dto.password });
    } catch (err) {
        const result = <MetaInterface>err.response.data.meta;
        expect(result.errorCode).toBe(ErrorCode.UNAUTHORIZED);
    }
});
