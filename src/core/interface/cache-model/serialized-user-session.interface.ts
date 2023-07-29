import { UserSession } from '../user-session.interface';

export type SerializedUserSession = Record<keyof UserSession, string>;
