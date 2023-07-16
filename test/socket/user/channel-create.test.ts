import { haveUsers } from '../../common/have-users.helper';
import { ChannelEvents } from '../../../src/core/enum/channel-gateway.enum';
import { sleep } from '../../common/helper';
import { decrypt, encrypt } from '../../common/crypto.helper';
import { ChannelCreateAck, ChannelCreateEmit } from '../../../src/modules/channel/emit';

it('Should user create channel', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    const dto: ChannelCreateEmit = {
        name: 'test',
        description: 'test'
    };
    await new Promise<void>(async (res, rej) => {
        A.client.emit(ChannelEvents.CHANNEL_CREATE, encrypt(dto), async (err, response: string) => {
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
});
