export const getGraphQLContext = async ({ req }) => {
  return {
    user: req.user,
    tenant: req.tenant
  };
};