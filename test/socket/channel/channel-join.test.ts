import { ChannelUserMongoModel, decrypt, haveUsers, sleep } from '../../common';
import { createChannel, joinChannel } from '../../common/channel.helper';
import { customUsers } from '../../test-setup';
import { BackendOriginated } from '../../../src/core/enum/backend-originated.enum';
import { ChannelJoinedSocketEmitEvent, ChannelUserRole, ChannelUserStatus } from '../../../src/core/interface';
import { Types } from 'mongoose';
import { MetaInterface } from '../../../src/core/interceptor';
import { ErrorCode } from '../../../src/core/error';

it('Should user join channel and joined user should receive channel joined event', async () => {
    const [A, B] = await haveUsers(2);
    customUsers.push(A, B);
    await Promise.all([A.connect(), B.connect()]);
    const { _id: channelId, name, description, createdAt } = await createChannel(A.client);
    await joinChannel(B.client, {
        channelId
    });
    await Promise.all([
        new Promise<void>((res) => {
            B.client.on(BackendOriginated.CHANNEL_JOINED, (response) => {
                const result = <ChannelJoinedSocketEmitEvent>decrypt(response);
                expect(result.channelId).toBe(channelId);
                expect(result.name).toBe(name);
                expect(result.description).toBe(description);
                expect(result.createdAt.toString()).toBe(createdAt.toString());
                res();
            });
        }),
        new Promise<void>(async (res, rej) => {
            A.client.on(BackendOriginated.CHANNEL_JOINED, () => {
                rej();
            });
            await sleep(250);
            res();
        })
    ]);

    const [channelUsersA, channelUsersB] = await Promise.all([
        ChannelUserMongoModel.findOne({ userId: A.user._id }).lean().exec(),
        ChannelUserMongoModel.findOne({ userId: B.user._id }).lean().exec()
    ]);
    expect(channelUsersA.role).toBe(ChannelUserRole.OWNER);
    expect(channelUsersA.channelId).toBe(channelId);
    expect(channelUsersA.status).toBe(ChannelUserStatus.ACTIVE);
    expect(channelUsersB.role).toBe(ChannelUserRole.SUBSCRIBER);
    expect(channelUsersB.channelId).toBe(channelId);
    expect(channelUsersB.status).toBe(ChannelUserStatus.ACTIVE);
});

it('should throw error if channel is not exist', async () => {
    const [A] = await haveUsers(1);
    customUsers.push(A);
    await A.connect();
    try {
        await joinChannel(A.client, {
            channelId: new Types.ObjectId().toString()
        });
    } catch (err) {
        const result = <MetaInterface>err;
        expect(result.errorCode).toBe(ErrorCode.CHANNEL_NOT_FOUND);
    }
});
