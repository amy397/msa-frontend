import { apiRequest } from './client';

const BASE_URL = '/api/users';

export const userApi = {
  getAll: () => apiRequest('get', BASE_URL),
  
  getById: (id) => apiRequest('get', `${BASE_URL}/${id}`),
  
  create: (data) => apiRequest('post', BASE_URL, data),
  
  update: (id, data) => apiRequest('put', `${BASE_URL}/${id}`, data),
  
  delete: (id) => apiRequest('delete', `${BASE_URL}/${id}`),
};