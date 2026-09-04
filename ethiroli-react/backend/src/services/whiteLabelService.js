export const getBrandedAssets = (tenantDetails) => {
  return {
    logo: tenantDetails.logo_url || '/assets/logo.png',
    theme: {
      primary: tenantDetails.primary_color || '#4F46E5',
      secondary: tenantDetails.secondary_color || '#0EA5E9'
    }
  };
};
