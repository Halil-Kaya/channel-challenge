export interface ChannelMessage {
    _id: string;
    channelId: string;
    message: string;
    sender: string;
    seenCount: number;
    createdAt: Date;
}
