export class ChannelSendMessageEmit {
    channelId: string;
    message: string;
}

export class ChannelSendMessageAck {
    channelId: string;
    messageId: string;
    message: string;
    sender: string;
    seenCount: number;
    createdAt: Date;
}
