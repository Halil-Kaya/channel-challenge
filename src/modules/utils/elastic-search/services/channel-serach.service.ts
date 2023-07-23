import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Channel } from '../../../../core/interface';
import { SearchIndex } from '../enum/search-index';

@Injectable()
export class ChannelSearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async search(text: string) {
        const { hits } = await this.elasticsearchService.search<Channel>({
            index: SearchIndex.CHANNEL_SEARCH,
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fields: ['name', 'description']
                    }
                }
            }
        });
        return hits.hits.map((item) => item._source);
    }

    insert(channel: Pick<Channel, '_id' | 'name' | 'description'>) {
        channel['id'] = channel._id;
        delete channel._id;
        return this.elasticsearchService.index({
            index: SearchIndex.CHANNEL_SEARCH,
            document: channel
        });
    }

    delete(channelId: string) {
        return this.elasticsearchService.deleteByQuery({
            index: SearchIndex.CHANNEL_SEARCH,
            body: {
                query: {
                    match: {
                        id: channelId
                    }
                }
            }
        });
    }

    async update(channelId: string, field: string, value: string) {
        return this.elasticsearchService.updateByQuery({
            index: SearchIndex.CHANNEL_SEARCH,
            body: {
                query: {
                    match: {
                        id: channelId
                    }
                },
                script: {
                    source: `ctx._source.${field} = "${value}"`
                }
            }
        });
    }
}
