import { Module } from '@nestjs/common';
import { ChannelGateway } from './gateway/channel.gateway';
import { ChannelService } from './service/channel.service';
import { ChannelCacheRepository, ChannelMongoRepository, ChannelRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelFactory } from './model/channel.model';

@Module({
    imports: [MongooseModule.forFeatureAsync([ChannelFactory])],
    providers: [ChannelGateway, ChannelService, ChannelRepository, ChannelMongoRepository, ChannelCacheRepository],
    exports: []
})
export class ChannelModule {}
