import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // 회원가입
      signup: async (data) => {
        set({ loading: true, error: null });
        const result = await authApi.signup(data);

        if (result.success) {
          set({ loading: false });
          return { success: true, data: result.data };
        } else {
          set({ error: result.error, loading: false });
          return { success: false, error: result.error };
        }
      },

      // 로그인
      login: async (data) => {
        set({ loading: true, error: null });
        const result = await authApi.login(data);

        if (result.success) {
          const { accessToken, tokenType, expiresIn } = result.data;
          localStorage.setItem('token', accessToken);

          set({
            token: accessToken,
            isAuthenticated: true,
            loading: false,
          });
          return { success: true };
        } else {
          set({ error: result.error, loading: false });
          return { success: false, error: result.error };
        }
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // 사용자 정보 조회
      fetchUser: async (id) => {
        set({ loading: true, error: null });
        const result = await authApi.getUser(id);

        if (result.success) {
          set({ user: result.data, loading: false });
        } else {
          set({ error: result.error, loading: false });
        }
        return result;
      },

      // 에러 초기화
      clearError: () => set({ error: null }),

      // 토큰 초기화 (앱 시작시)
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
