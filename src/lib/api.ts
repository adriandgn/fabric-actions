type Collection = 'events' | 'artworks' | 'urban_interventions' | 'event_posts' | 'exhibition_info';

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...init });
  if (!response.ok) throw new Error(response.status === 401 ? 'Invalid password or session expired.' : 'The server could not complete the request.');
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function json(method: string, value: unknown): RequestInit {
  return { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value) };
}

export const api = {
  login: (password: string) => request<void>('/api/session/login', json('POST', { password })),
  session: () => request<{ authenticated: boolean }>('/api/session'),
  logout: () => request<void>('/api/session/logout', { method: 'POST' }),
  list: <T>(collection: Collection) => request<T[]>(`/api/content/${collection}`),
  save: <T>(collection: Collection, data: unknown, id?: number | string) =>
    request<T>(`/api/content/${collection}${id === undefined ? '' : `/${id}`}`, json(id === undefined ? 'POST' : 'PUT', data)),
  remove: (collection: Collection, id: number | string) => request<void>(`/api/content/${collection}/${id}`, { method: 'DELETE' }),
  upload: (file: File) => {
    const body = new FormData();
    body.append('image', file);
    return request<{ url: string }>('/api/uploads', { method: 'POST', body });
  },
};
