import { apiRequest } from './client';

const BASE_URL = '/api/products';

/**
 * ProductStatus enum values
 * @typedef {'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED'} ProductStatus
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} stock
 * @property {string} category
 * @property {ProductStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ProductRequest
 * @property {string} name
 * @property {string} [description]
 * @property {number} price
 * @property {number} stock
 * @property {string} [category]
 */

/**
 * @typedef {Object} StockRequest
 * @property {number} quantity
 */

export const productApi = {
  // 전체 조회
  getAll: () => apiRequest('get', BASE_URL),

  // 단건 조회
  getById: (id) => apiRequest('get', `${BASE_URL}/${id}`),

  // 카테고리별 조회
  getByCategory: (category) => apiRequest('get', `${BASE_URL}/category/${category}`),

  // 판매중 상품 조회
  getAvailable: () => apiRequest('get', `${BASE_URL}/available`),

  // 상품 검색
  search: (keyword) => apiRequest('get', `${BASE_URL}/search`, null, { params: { keyword } }),

  // 생성
  create: (data) => apiRequest('post', BASE_URL, data),

  // 수정
  update: (id, data) => apiRequest('put', `${BASE_URL}/${id}`, data),

  // 삭제
  delete: (id) => apiRequest('delete', `${BASE_URL}/${id}`),

  // 재고 감소
  decreaseStock: (id, quantity) => apiRequest('post', `${BASE_URL}/${id}/stock/decrease`, { quantity }),

  // 재고 증가
  increaseStock: (id, quantity) => apiRequest('post', `${BASE_URL}/${id}/stock/increase`, { quantity }),

  // 헬스체크
  health: () => apiRequest('get', `${BASE_URL}/health`),
};
