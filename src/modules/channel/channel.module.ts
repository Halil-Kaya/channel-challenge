import { Module } from '@nestjs/common';
import { ChannelGateway } from './gateway/channel.gateway';
import { ChannelService } from './service/channel.service';
import { ChannelCacheRepository, ChannelMongoRepository, ChannelRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelFactory } from './model/channel.model';
import { ChannelUserModule } from '../channel-user/channel-user.module';
import { ElasticSearchModule } from '../utils/elastic-search/elastic-search.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([ChannelFactory]), ChannelUserModule, ElasticSearchModule],
    providers: [ChannelGateway, ChannelService, ChannelRepository, ChannelMongoRepository, ChannelCacheRepository],
    exports: []
})
export class ChannelModule {}
