import { Client } from '@elastic/elasticsearch';
import { SearchIndex } from '../../../src/modules/utils/elastic-search/enum/search-index';

export const esClient = new Client({
    nodes: ['http://localhost:9200']
});

export const resetElasticsearch = async () => {
    try {
        await esClient.deleteByQuery({
            index: SearchIndex.CHANNEL_SEARCH,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
    } catch (err) {}
};
