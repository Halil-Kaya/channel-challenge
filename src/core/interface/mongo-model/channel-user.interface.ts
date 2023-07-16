export interface ChannelUser {
    _id: string;
    userId: string;
    channelId: string;
    status: ChannelUserStatus;
    createdAt: Date;
}

export enum ChannelUserStatus {
    ACTIVE = 'active',
    REMOVED = 'removed'
}
