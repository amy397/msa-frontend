import { apiRequest } from './client';

const BASE_URL = '/api/payments';

export const paymentApi = {
  // 전체 결제 내역 조회
  getAll: () => apiRequest('get', BASE_URL),

  // 결제 단건 조회
  getById: (id) => apiRequest('get', `${BASE_URL}/${id}`),

  // 사용자별 결제 내역 조회
  getByUserId: (userId) => apiRequest('get', `${BASE_URL}/user/${userId}`),

  // 주문별 결제 조회
  getByOrderId: (orderId) => apiRequest('get', `${BASE_URL}/order/${orderId}`),

  // 결제 생성 (결제 요청)
  create: (data) => apiRequest('post', BASE_URL, data),

  // 결제 승인
  confirm: (id, data) => apiRequest('post', `${BASE_URL}/${id}/confirm`, data),

  // 결제 취소
  cancel: (id, data) => apiRequest('post', `${BASE_URL}/${id}/cancel`, data),

  // 결제 상태 변경
  updateStatus: (id, status) => apiRequest('patch', `${BASE_URL}/${id}/status`, { status }),

  // 환불 요청
  refund: (id, data) => apiRequest('post', `${BASE_URL}/${id}/refund`, data),
};
