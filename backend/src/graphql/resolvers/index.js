export const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.user) throw new Error('Unauthenticated');
      return context.user;
    },
    globalSearch: (parent, { query }, context) => {
      return { message: 'Elasticsearch query matched: ' + query };
    }
  }
};