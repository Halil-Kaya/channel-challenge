import { Module } from '@nestjs/common';
import { ChannelUserInternalService } from './service/channel-user-internal.service';
import { ChannelUserRepository } from './repository/channel-user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelUserFactory } from './model/channel-user.model';

@Module({
    imports: [MongooseModule.forFeatureAsync([ChannelUserFactory])],
    providers: [ChannelUserRepository, ChannelUserInternalService],
    exports: [ChannelUserInternalService]
})
export class ChannelUserModule {}
