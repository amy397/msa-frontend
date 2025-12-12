import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

// JWT 토큰 디코딩 함수
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      userId: null,
      userEmail: null,
      userRole: null,
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
          const { accessToken } = result.data;
          localStorage.setItem('token', accessToken);

          // JWT 토큰에서 사용자 정보 추출
          const decoded = decodeToken(accessToken);
          const userId = decoded?.sub || decoded?.userId || decoded?.id;
          const userEmail = decoded?.email || data.email;
          const userRole = decoded?.role || 'USER';

          set({
            token: accessToken,
            userId,
            userEmail,
            userRole,
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
          userId: null,
          userEmail: null,
          userRole: null,
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

      // 내 정보 조회
      fetchMyProfile: async () => {
        const { userId } = get();
        if (!userId) {
          set({ error: '로그인이 필요합니다.', loading: false });
          return { success: false, error: '로그인이 필요합니다.' };
        }

        set({ loading: true, error: null });
        const result = await authApi.getUser(userId);

        if (result.success) {
          set({ user: result.data, loading: false });
        } else {
          set({ error: result.error, loading: false });
        }
        return result;
      },

      // 관리자 여부 확인
      isAdmin: () => {
        const { userRole } = get();
        return userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
      },

      // 에러 초기화
      clearError: () => set({ error: null }),

      // 토큰 초기화 (앱 시작시)
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = decodeToken(token);
          const userId = decoded?.sub || decoded?.userId || decoded?.id;
          const userEmail = decoded?.email;
          const userRole = decoded?.role || 'USER';

          set({
            token,
            userId,
            userEmail,
            userRole,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userId: state.userId,
        userEmail: state.userEmail,
        userRole: state.userRole,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
