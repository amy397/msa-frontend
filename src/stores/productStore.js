import { create } from 'zustand';
import { productApi } from '../api/productApi';

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,

  // 전체 조회
  fetchProducts: async () => {
    set({ loading: true, error: null });
    const result = await productApi.getAll();

    if (result.success) {
      set({ products: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // 단건 조회
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    const result = await productApi.getById(id);
    set({ loading: false });
    return result;
  },

  // 생성
  createProduct: async (data) => {
    set({ loading: true });
    const result = await productApi.create(data);

    if (result.success) {
      await get().fetchProducts();
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 수정
  updateProduct: async (id, data) => {
    set({ loading: true });
    const result = await productApi.update(id, data);

    if (result.success) {
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? { ...product, ...data } : product
        ),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 삭제
  deleteProduct: async (id) => {
    set({ loading: true });
    const result = await productApi.delete(id);

    if (result.success) {
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 선택
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // 에러 초기화
  clearError: () => set({ error: null }),
}));
