import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchIndex } from '../enum/search-index';
import { ChannelElastic } from '../interface';

@Injectable()
export class ChannelSearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    async search(text: string): Promise<ChannelElastic[]> {
        const { hits } = await this.elasticsearchService.search<ChannelElastic>({
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

    insert(channelElastic: ChannelElastic) {
        return this.elasticsearchService.index({
            index: SearchIndex.CHANNEL_SEARCH,
            document: channelElastic
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
