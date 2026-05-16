const API_BASE_URL = 'http://localhost:8000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Tamu
  getTamu: (params?: { id_user?: number | string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/tamu?${query}`);
  },
  createTamu: (data: any) => apiFetch('/tamu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }),
  deleteTamu: (id: number) => apiFetch(`/tamu/${id}`, {
    method: 'DELETE'
  }),

  // Keluhan
  getKeluhan: (params?: { id_user?: number | string; role?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/keluhan?${query}`);
  },
  createKeluhan: (formData: FormData) => apiFetch('/keluhan', {
    method: 'POST',
    body: formData // No Content-Type header for FormData, browser sets it with boundary
  }),
  updateKeluhanStatus: (id: number, status: string) => apiFetch(`/keluhan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }),
  deleteKeluhan: (id: number) => apiFetch(`/keluhan/${id}`, {
    method: 'DELETE'
  }),

  // Kamar
  getKamarTerisi: () => apiFetch('/kamar/terisi'),
};
