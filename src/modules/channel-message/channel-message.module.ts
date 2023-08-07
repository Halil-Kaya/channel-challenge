import { Module } from '@nestjs/common';
import { ChannelMessageGateway } from './gateway/channel-message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelMessageRepository } from './repository/channel-message.repository';
import { ChannelMessageService } from './service/channel-message.service';
import { ChannelModule } from '../channel/channel.module';
import { ChannelUserModule } from '../channel-user/channel-user.module';
import { ChannelMessageBroadcastHandler } from './broadcast/channel-message-broadcast.handler';
import { CustomRabbitMqModule } from '../utils/rabbitmq/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { ChannelMessageFactory, UnseenChannelMessageFactory } from './model';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([ChannelMessageFactory, UnseenChannelMessageFactory]),
        CustomRabbitMqModule,
        UserModule,
        ChannelModule,
        ChannelUserModule
    ],
    providers: [ChannelMessageGateway, ChannelMessageRepository, ChannelMessageService, ChannelMessageBroadcastHandler]
})
export class ChannelMessageModule {}
