import { create } from 'zustand';
import { userApi } from '../api/userApi';

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  selectedUser: null,

  // 전체 조회
  fetchUsers: async () => {
    set({ loading: true, error: null });
    const result = await userApi.getAll();

    if (result.success) {
      set({ users: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // 생성
  createUser: async (data) => {
    set({ loading: true });
    const result = await userApi.create(data);

    if (result.success) {
      await get().fetchUsers();
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 삭제
  deleteUser: async (id) => {
    set({ loading: true });
    const result = await userApi.delete(id);

    if (result.success) {
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // 선택
  setSelectedUser: (user) => set({ selectedUser: user }),

  // 에러 초기화
  clearError: () => set({ error: null }),
}));
