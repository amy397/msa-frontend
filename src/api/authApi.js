import { apiRequest } from './client';

const BASE_URL = '/api/users';

export const authApi = {
  // 회원가입
  signup: (data) => apiRequest('post', `${BASE_URL}/signup`, data),

  // 로그인
  login: (data) => apiRequest('post', `${BASE_URL}/login`, data),

  // 사용자 조회
  getUser: (id) => apiRequest('get', `${BASE_URL}/${id}`),

  // 헬스체크
  health: () => apiRequest('get', `${BASE_URL}/health`),
};
