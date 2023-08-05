import { ChannelSendMessageAck } from '../../../modules/channel-message/emit';

export interface ChannelSendMessageBroadcastEvent {
    message: ChannelSendMessageAck;
}
