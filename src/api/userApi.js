import { apiRequest } from './client';

const BASE_URL = '/api/users';

/**
 * @typedef {Object} SignUpRequest
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {string} [phone]
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserResponse
 * @property {number} id
 * @property {string} email
 * @property {string} name
 * @property {string} phone
 * @property {string} role
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TokenResponse
 * @property {string} accessToken
 * @property {string} tokenType
 * @property {number} expiresIn
 */

export const userApi = {
  // 일반 회원가입
  signUp: (data) => apiRequest('post', `${BASE_URL}/signup`, data),

  // 관리자 회원가입
  adminSignUp: (data) => apiRequest('post', `${BASE_URL}/admin/signup`, data),

  // 로그인
  login: (data) => apiRequest('post', `${BASE_URL}/login`, data),

  // 사용자 조회
  getById: (id) => apiRequest('get', `${BASE_URL}/${id}`),

  // 전체 사용자 조회
  getAll: () => apiRequest('get', BASE_URL),

  // 사용자 생성
  create: (data) => apiRequest('post', BASE_URL, data),

  // 사용자 수정
  update: (id, data) => apiRequest('put', `${BASE_URL}/${id}`, data),

  // 사용자 삭제
  delete: (id) => apiRequest('delete', `${BASE_URL}/${id}`),

  // 헬스체크
  health: () => apiRequest('get', `${BASE_URL}/health`),
};
