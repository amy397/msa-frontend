import { apiRequest } from './client';

export const paymentApi = {
  // 결제 준비 (주문 생성)
  preparePayment: async (orderData) => {
    return apiRequest('post', '/api/orders', orderData);
  },

  // 결제 승인 요청
  confirmPayment: async (paymentData) => {
    return apiRequest('post', '/api/payments/confirm', paymentData);
  },

  // 주문 내역 조회
  getOrders: async (userId) => {
    return apiRequest('get', `/api/orders/user/${userId}`);
  },

  // 주문 상세 조회
  getOrderById: async (orderId) => {
    return apiRequest('get', `/api/orders/${orderId}`);
  },

  // 결제 취소
  cancelPayment: async (orderId) => {
    return apiRequest('post', `/api/payments/cancel/${orderId}`);
  },
};
