export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    throw new ApiError(result?.error || `Request failed (${response.status}).`, response.status);
  }
  return result;
}

export const collectionApi = (collection) => ({
  create: (data) => apiRequest(`/api/${collection}`, { method: 'POST', body: { data } }),
  update: (id, data) => apiRequest(`/api/${collection}/${encodeURIComponent(id)}`, { method: 'PATCH', body: { data } }),
  remove: (id) => apiRequest(`/api/${collection}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
});
