import { Channel } from '../mongo-model';

export type SerializedChannel = Record<keyof Channel, string>;
