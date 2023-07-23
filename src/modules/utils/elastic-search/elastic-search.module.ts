import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '../../../core/interface';
import { ChannelSearchService } from './services/channel-serach.service';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService<Environment>) => ({
                node: configService.get('ELASTICSEARCH_NODE'),
                auth: {
                    username: configService.get('ELASTICSEARCH_USERNAME'),
                    password: configService.get('ELASTICSEARCH_PASSWORD')
                }
            }),
            inject: [ConfigService]
        })
    ],
    providers: [ChannelSearchService],
    exports: [ChannelSearchService]
})
export class ElasticSearchModule {}
