import { logger } from '../config/logger.js';

export const indexDocument = async (type, id, data) => {
  logger.info('Indexing document in Elasticsearch', { type, id });

  try {
    const esHost = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
    const indexName = `ethiroli_${type}`;

    const response = await fetch(`${esHost}/${indexName}/_doc/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        indexed_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Elasticsearch error: ${response.status}`);
    }

    logger.info('Document indexed', { type, id, index: indexName });

    return {
      success: true,
      type,
      id,
      index: indexName,
      result: await response.json()
    };
  } catch (error) {
    logger.error('Elasticsearch indexing failed', { type, id, error: error.message });
    return { success: false, error: error.message };
  }
};

export const search = async (query, filters = {}) => {
  logger.info('Searching Elasticsearch', { query, filters });

  try {
    const esHost = process.env.ELASTICSEARCH_HOST || 'http://localhost:9200';
    const indices = filters.types?.map(t => `ethiroli_${t}`).join(',') || 'ethiroli_*';

    const esQuery = {
      query: {
        bool: {
          must: [
            { multi_match: { query, fields: ['*'] } }
          ],
          filter: []
        }
      },
      size: filters.limit || 20,
      from: filters.offset || 0
    };

    if (filters.types?.length) {
      esQuery.query.bool.filter.push({ terms: { _index: filters.types.map(t => `ethiroli_${t}`) } });
    }

    const response = await fetch(`${esHost}/${indices}/_search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(esQuery)
    });

    if (!response.ok) {
      throw new Error(`Elasticsearch error: ${response.status}`);
    }

    const result = await response.json();

    const hits = (result.hits?.hits || []).map(hit => ({
      id: hit._id,
      type: hit._index.replace('ethiroli_', ''),
      score: hit._score,
      data: hit._source
    }));

    logger.info('Elasticsearch search completed', { query, total: hits.length });

    return {
      success: true,
      query,
      results: hits,
      total: result.hits?.total?.value || hits.length,
      took: result.took
    };
  } catch (error) {
    logger.error('Elasticsearch search failed', { query, error: error.message });
    return { success: false, error: error.message, results: [] };
  }
};
