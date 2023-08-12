export class ChannelMessagesGetEmit {
    channelId: string;
    prev?: string;
    next?: string;
    around?: string;
    limit: number;
}

export class ChannelMessagesGetAck {
    messages: {
        messageId: string;
        channelId: string;
        message: string;
        sender: string;
        seenCount: number;
        createdAt: Date;
    }[];
}
