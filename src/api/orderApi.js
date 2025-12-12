import { apiRequest } from './client';

const BASE_URL = '/api/orders';

export const orderApi = {
  getAll: () => apiRequest('get', BASE_URL),

  getById: (id) => apiRequest('get', `${BASE_URL}/${id}`),

  getByUserId: (userId) => apiRequest('get', `${BASE_URL}/user/${userId}`),

  create: (data) => apiRequest('post', BASE_URL, data),

  update: (id, data) => apiRequest('put', `${BASE_URL}/${id}`, data),

  updateStatus: (id, status) => apiRequest('patch', `${BASE_URL}/${id}/status`, { status }),

  delete: (id) => apiRequest('delete', `${BASE_URL}/${id}`),
};
