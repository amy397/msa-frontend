import { apiRequest } from './client';

const BASE_URL = '/api/payments';

export const paymentApi = {
  // 결제 준비 (주문 생성)
  preparePayment: (data) => apiRequest('post', `${BASE_URL}/prepare`, data),

  // 결제 승인 (Toss 결제 완료 후)
  confirmPayment: (data) => apiRequest('post', `${BASE_URL}/confirm`, data),

  // 결제 내역 조회
  getPaymentsByUserId: (userId) => apiRequest('get', `${BASE_URL}/user/${userId}`),

  // 결제 상세 조회
  getPaymentById: (paymentId) => apiRequest('get', `${BASE_URL}/${paymentId}`),

  // 결제 취소
  cancelPayment: (paymentId, reason) =>
    apiRequest('post', `${BASE_URL}/${paymentId}/cancel`, { reason }),
};
