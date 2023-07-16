export interface ChannelUser {
    _id: string;
    userId: string;
    channelId: string;
    status: ChannelUserStatus;
    role: ChannelUserRole;
    createdAt: Date;
}

export enum ChannelUserStatus {
    ACTIVE = 'active',
    REMOVED = 'removed'
}

export enum ChannelUserRole {
    SUBSCRIBER = 'subscriber',
    OWNER = 'owner'
}
