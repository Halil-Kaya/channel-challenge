export class ChannelCreateEmit {
    name: string;
    description: string;
}

export class ChannelCreateAck {
    _id: string;
    name: string;
    description: string;
    owner: string;
    createdAt: Date;
}
