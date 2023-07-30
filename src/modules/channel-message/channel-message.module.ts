import { Module } from '@nestjs/common';
import { ChannelMessageGateway } from './gateway/channel-message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelMessageFactory } from './model/channel-message.model';
import { ChannelMessageRepository } from './repository/channel-message.repository';
import { ChannelMessageService } from './service/channel-message.service';
import { ChannelModule } from '../channel/channel.module';
import { ChannelUserModule } from '../channel-user/channel-user.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([ChannelMessageFactory]), ChannelModule, ChannelUserModule],
    providers: [ChannelMessageGateway, ChannelMessageRepository, ChannelMessageService]
})
export class ChannelMessageModule {}
