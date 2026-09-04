export const searchClusterEntities = async (queryText) => {
  console.log('[Elasticsearch Service Mock] Running fuzzy relevance lookup: ' + queryText);
  return { hits: [] };
};
