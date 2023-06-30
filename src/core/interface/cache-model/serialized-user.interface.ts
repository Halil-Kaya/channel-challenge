import { User } from '../mongo-model';

export type SerializedUser = Record<keyof Omit<User, 'password'>, string>;
