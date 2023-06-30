import { User } from '../mongo-model';

export type SessionUser = Record<keyof Pick<User, '_id' | 'nickname'>, string>;
