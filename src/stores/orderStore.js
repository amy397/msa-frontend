import { create } from 'zustand';
import { orderApi } from '../api/orderApi';

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,
  selectedOrder: null,

  // 전체 조회
  fetchOrders: async () => {
    set({ loading: true, error: null });
    const result = await orderApi.getAll();

    if (result.success) {
      set({ orders: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // 단건 조회
  fetchOrderById: async (id) => {
    set({ loading: true, error: null });
    const result = await orderApi.getById(id);
    set({ loading: false });
    return result;
  },

  // 사용자별 주문 조회
  fetchOrdersByUserId: async (userId) => {
    set({ loading: true, error: null });
    const result = await orderApi.getByUserId(userId);

    if (result.success) {
      set({ orders: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 생성
  createOrder: async (data) => {
    set({ loading: true });
    const result = await orderApi.create(data);

    if (result.success) {
      await get().fetchOrders();
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 상태 변경
  updateOrderStatus: async (id, status) => {
    set({ loading: true });
    const result = await orderApi.updateStatus(id, status);

    if (result.success) {
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? { ...order, status } : order
        ),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 삭제
  deleteOrder: async (id) => {
    set({ loading: true });
    const result = await orderApi.delete(id);

    if (result.success) {
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 선택
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // 에러 초기화
  clearError: () => set({ error: null }),
}));
