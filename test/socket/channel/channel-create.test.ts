import { ChannelMongoModel, ChannelUserMongoModel, decrypt, encrypt, haveUsers, sleep } from '../../common';
import { ChannelCreateAck, ChannelCreateEmit } from '../../../src/modules/channel/emit';
import { customUsers } from '../../test-setup';
import { ChannelGatewayEvent } from '../../../src/core/enum';
import { ChannelUserRole, ChannelUserStatus } from '../../../src/core/interface';

it('Should user create channel', async () => {
    const [A] = await haveUsers(1);
    customUsers.push(A);
    await A.connect();
    const dto: ChannelCreateEmit = {
        name: 'test',
        description: 'test'
    };
    await new Promise<void>(async (res, rej) => {
        A.client.emit(ChannelGatewayEvent.CHANNEL_CREATE, encrypt(dto), async (err, response: string) => {
            expect(err).toBeNull();
            const result: ChannelCreateAck = decrypt(response);
            expect(result._id).toBeDefined();
            expect(result.createdAt).toBeDefined();
            expect(result.name).toBe(dto.name);
            expect(result.description).toBe(dto.description);
            expect(result.owner).toBe(A.user._id);
            res();
        });
        await sleep(200);
        rej();
    });
    const createdChannel = await ChannelMongoModel.findOne().lean().exec();
    expect(createdChannel).toBeDefined();
    expect(createdChannel.owner).toBe(A.user._id);

    const channelUser = await ChannelUserMongoModel.findOne({
        channelId: createdChannel._id,
        userId: A.user._id
    })
        .lean()
        .exec();
    expect(channelUser).toBeDefined();
    expect(channelUser.role).toBe(ChannelUserRole.OWNER);
    expect(channelUser.status).toBe(ChannelUserStatus.ACTIVE);
});
