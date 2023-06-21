import { createUser } from '../../common/user.helper';
import { UserMongoModel } from '../../common/db';
import { UserCreateDto } from '../../../src/modules/user/controller/dto';
import * as bcrypt from 'bcryptjs';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';

it('should create user', async () => {
    const dto: UserCreateDto = {
        fullName: 'Hlk',
        nickname: 'hlk@root',
        password: '12345678'
    };
    await createUser(dto);
    const createdUser = await UserMongoModel.findOne({
        nickname: dto.nickname
    })
        .lean()
        .exec();
    expect(createdUser.fullName).toBe(dto.fullName);
    expect(createdUser.nickname).toBe(dto.nickname);
    expect(createdUser.createdAt).toBeDefined();
    const isPasswordMatch = bcrypt.compare(createdUser.password, dto.password);
    expect(isPasswordMatch).toBeTruthy();
});

it('should throw error if nickname is taken', async () => {
    const reqDto: UserCreateDto = {
        fullName: '#test-user',
        nickname: Math.random().toString(36).slice(2, 16),
        password: 'passw@rd'
    };
    await createUser(reqDto);
    try {
        await createUser(reqDto);
        expect(undefined).toBeDefined();
    } catch (err) {
        const result = <MetaInterface>err.response.data.meta;
        expect(result.errorCode).toBe(ErrorCode.NICKNAME_ALREADY_TAKEN);
    }
});

it('q', () => {});

it('should prevent user create nickname race condition', async () => {
    const nickname = 'hlkroot';
    const raceCondition = async () => {
        await Promise.all(
            new Array(3).fill(0).map(async () => {
                const reqDto: UserCreateDto = {
                    fullName: Math.random().toString(36).slice(2, 16),
                    password: Math.random().toString(36).slice(2, 16),
                    nickname
                };
                try {
                    await createUser(reqDto);
                } catch (err) {
                    const result = <MetaInterface>err.response.data.meta;
                    expect(result.errorCode).toBe(ErrorCode.RACE_CONDITION);
                }
            })
        );
    };
    await raceCondition();
    const count = await UserMongoModel.count({
        nickname
    })
        .lean()
        .exec();
    expect(count).toBe(1);
});
