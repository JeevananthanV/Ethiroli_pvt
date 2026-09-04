const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiGet = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    const error = new Error('unauthorized');
    error.status = 401;
    throw error;
  }

  return response.json();
};

export const apiPost = async (path, body) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    const error = new Error('unauthorized');
    error.status = 401;
    throw error;
  }

  return response.json();
};

export const apiDownload = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    const error = new Error('unauthorized');
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    throw new Error('download_failed');
  }

  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="(.+)"/i);

  return { blob, filename: match?.[1] };
};
