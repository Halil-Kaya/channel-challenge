import { Module } from '@nestjs/common';
import { ChannelGateway } from './gateway/channel.gateway';
import { ChannelService } from './service/channel.service';
import { ChannelCacheRepository, ChannelMongoRepository, ChannelRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelFactory } from './model/channel.model';
import { ChannelUserModule } from '../channel-user/channel-user.module';
import { ElasticSearchModule } from '../utils/elastic-search/elastic-search.module';
import { LockService } from '../../core/service';
import { CustomRabbitMqModule } from '../utils/rabbitmq/rabbitmq.module';
import { UserModule } from '../user/user.module';
import { ChannelBroadcastHandler } from './broadcast/channel-broadcast.handler';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([ChannelFactory]),
        ChannelUserModule,
        ElasticSearchModule,
        CustomRabbitMqModule,
        UserModule
    ],
    providers: [
        ChannelGateway,
        ChannelService,
        ChannelRepository,
        ChannelMongoRepository,
        ChannelCacheRepository,
        LockService,
        ChannelBroadcastHandler
    ],
    exports: []
})
export class ChannelModule {}
