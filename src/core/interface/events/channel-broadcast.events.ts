import { Channel } from '../index';

export interface ChannelJoinedBroadcastEvent {
    channel: Channel;
}

export interface ChannelLeftBroadcastEvent {
    channelId: string;
}
