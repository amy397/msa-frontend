import { create } from 'zustand';
import { paymentApi } from '../api/paymentApi';

export const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,
  selectedPayment: null,

  // 전체 조회
  fetchPayments: async () => {
    set({ loading: true, error: null });
    const result = await paymentApi.getAll();

    if (result.success) {
      set({ payments: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // 단건 조회
  fetchPaymentById: async (id) => {
    set({ loading: true, error: null });
    const result = await paymentApi.getById(id);
    set({ loading: false });
    return result;
  },

  // 사용자별 결제 내역 조회
  fetchPaymentsByUserId: async (userId) => {
    set({ loading: true, error: null });
    const result = await paymentApi.getByUserId(userId);

    if (result.success) {
      set({ payments: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 주문별 결제 조회
  fetchPaymentByOrderId: async (orderId) => {
    set({ loading: true, error: null });
    const result = await paymentApi.getByOrderId(orderId);
    set({ loading: false });
    return result;
  },

  // 결제 생성
  createPayment: async (data) => {
    set({ loading: true });
    const result = await paymentApi.create(data);

    if (result.success) {
      await get().fetchPayments();
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 결제 승인
  confirmPayment: async (id, data) => {
    set({ loading: true });
    const result = await paymentApi.confirm(id, data);

    if (result.success) {
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === id ? { ...payment, status: 'COMPLETED', ...result.data } : payment
        ),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 결제 취소
  cancelPayment: async (id, data) => {
    set({ loading: true });
    const result = await paymentApi.cancel(id, data);

    if (result.success) {
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === id ? { ...payment, status: 'CANCELLED' } : payment
        ),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 환불 요청
  refundPayment: async (id, data) => {
    set({ loading: true });
    const result = await paymentApi.refund(id, data);

    if (result.success) {
      set((state) => ({
        payments: state.payments.map((payment) =>
          payment.id === id ? { ...payment, status: 'REFUNDED' } : payment
        ),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 선택
  setSelectedPayment: (payment) => set({ selectedPayment: payment }),

  // 에러 초기화
  clearError: () => set({ error: null }),
}));
