import { Module } from '@nestjs/common';
import { ChannelMessageGateway } from './gateway/channel-message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModule } from '../channel/channel.module';
import { ChannelUserModule } from '../channel-user/channel-user.module';
import { ChannelMessageBroadcastHandler } from './broadcast/channel-message-broadcast.handler';
import { CustomRabbitMqModule } from '../utils/rabbitmq/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { ChannelMessageFactory, UnseenChannelMessageFactory } from './model';
import { ChannelMessageRepository, UnseenChannelMessageRepository } from './repository';
import { ChannelMessageService, UnseenChannelMessageService } from './service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([ChannelMessageFactory, UnseenChannelMessageFactory]),
        CustomRabbitMqModule,
        UserModule,
        ChannelModule,
        ChannelUserModule
    ],
    providers: [
        ChannelMessageGateway,
        ChannelMessageRepository,
        ChannelMessageService,
        UnseenChannelMessageRepository,
        UnseenChannelMessageService,
        ChannelMessageBroadcastHandler
    ]
})
export class ChannelMessageModule {}
