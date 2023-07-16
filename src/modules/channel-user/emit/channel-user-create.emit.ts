import { ChannelUserRole } from '../../../core/interface';

export class ChannelUserCreateEmit {
    userId: string;
    channelId: string;
    role: ChannelUserRole;
}

export class ChannelUserCreateAck {}
