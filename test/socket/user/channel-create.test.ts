import { haveUsers } from '../../common/have-users.helper';
import { ChannelEvents } from '../../../src/core/enum/channel-gateway.enum';
import { sleep } from '../../common/helper';
import { decrypt, encrypt } from '../../common/crypto.helper';

it('Should user create channelq', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    await new Promise<void>(async (res, rej) => {
        A.client.emit(ChannelEvents.CHANNEL_CREATE, encrypt({ pokemon: 2 }), async (err, response) => {
            console.log({ response, err });
            err = decrypt(err);
            response = decrypt(response);
            console.log({ response, err });
            res();
        });
        await sleep(500);
        rej();
    });
});
