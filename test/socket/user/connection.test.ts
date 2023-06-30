import { haveUsers } from '../../common/have-users.helper';
import { sleep } from '../../common/helper';

it('Should user connect and disconnect socket', async () => {
    const [A] = await haveUsers(1);
    await A.connect();
    await sleep(1000);
});
