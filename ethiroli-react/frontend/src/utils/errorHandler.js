export function handleApiError(error) {
  if (typeof window !== 'undefined' && window.__axios__ && error?.response) {
    return error.response.data?.message || error.message || 'An unexpected error occurred.';
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export function logErrorToService(error, context = '') {
  const prefix = context ? `[${context}]` : '';
  console.error(`${prefix}`, error);
}
