import { createUser } from '../../common/user.helper';

it('should create user', async () => {
    const result = await createUser();
    console.log({ result });
});
