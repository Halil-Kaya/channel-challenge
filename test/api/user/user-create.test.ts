import { createUser } from '../../common/user.helper';
import { getRedis, UserMongoModel } from '../../common/db';
import { UserCreateDto } from '../../../src/modules/user/dto';
import * as bcrypt from 'bcryptjs';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';
import { cacheKeys } from '../../../src/core/cache';

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
        .select('+password')
        .lean()
        .exec();
    expect(createdUser.fullName).toBe(dto.fullName);
    expect(createdUser.nickname).toBe(dto.nickname);
    expect(createdUser.createdAt).toBeDefined();
    const isPasswordMatch = bcrypt.compare(createdUser.password, dto.password);
    expect(isPasswordMatch).toBeTruthy();

    const redis = await getRedis();
    const userInRedis = await redis.hGetAll(cacheKeys.user(createdUser._id));
    expect(userInRedis._id).toBe(createdUser._id.toString());
    expect(userInRedis.fullName).toBe(createdUser.fullName);
    expect(userInRedis.nickname).toBe(createdUser.nickname);
    expect(userInRedis.isOnline).toBe('0');
    expect(userInRedis.createdAt).toBe(createdUser.createdAt.toISOString());
    expect(userInRedis.password).toBeUndefined();
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
