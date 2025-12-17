import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '../api/userApi';
import { useCartStore } from './cartStore';

// 토큰에서 사용자 ID 추출 (JWT 디코딩)
const parseToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch {
    return null;
  }
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      // 인증 상태
      isAuthenticated: false,
      currentUser: null,
      token: null,

      // 테스트용 관리자 모드 (백엔드 role과 별개)
      isAdminMode: false,

      // 사용자 목록 (관리용)
      users: [],
      loading: false,
      error: null,
      selectedUser: null,

      // 회원가입
      signUp: async (data) => {
        set({ loading: true, error: null });
        const result = await userApi.signUp(data);

        if (result.success) {
          set({ loading: false });
        } else {
          set({ error: result.error, loading: false });
        }
        return result;
      },

      // 로그인
      login: async (data) => {
        set({ loading: true, error: null });
        const result = await userApi.login(data);

        if (result.success) {
          const { accessToken } = result.data;
          localStorage.setItem('token', accessToken);

          // 토큰에서 사용자 정보 파싱
          const payload = parseToken(accessToken);

          // 토큰에서 기본 사용자 정보 설정
          const userFromToken = payload ? {
            id: payload.userId || payload.sub,
            email: payload.email || payload.sub,
            name: payload.name || data.email?.split('@')[0] || '사용자',
            role: payload.role || 'USER',
          } : null;

          set({
            isAuthenticated: true,
            token: accessToken,
            currentUser: userFromToken,
            loading: false,
          });

          // API로 상세 사용자 정보 조회 시도
          if (payload?.sub) {
            const userResult = await get().fetchCurrentUser(payload.sub);
            // API 실패 시 토큰 정보 유지
            if (!userResult?.success && userFromToken) {
              set({ currentUser: userFromToken });
            }
          }
        } else {
          set({ error: result.error, loading: false });
        }
        return result;
      },

      // 로그아웃
      logout: () => {
        // 장바구니 상태 초기화
        useCartStore.getState().clearCart();

        localStorage.removeItem('token');
        localStorage.removeItem('cart-storage');
        localStorage.removeItem('user-storage');

        set({
          isAuthenticated: false,
          currentUser: null,
          token: null,
          isAdminMode: false,
        });

        // 페이지 새로고침으로 Zustand 상태 완전 초기화
        window.location.href = '/';
      },

      // 관리자 모드 설정 (테스트용)
      setAdminMode: (value) => set({ isAdminMode: value }),

      // 현재 사용자 정보 조회
      fetchCurrentUser: async (id) => {
        const result = await userApi.getById(id);
        if (result.success) {
          // 기존 토큰에서 파싱한 role 유지
          const currentUser = get().currentUser;
          const tokenRole = currentUser?.role;

          set({
            currentUser: {
              ...result.data,
              // API 응답에 role이 없으면 토큰의 role 사용
              role: result.data.role || tokenRole || 'USER',
            },
          });
        }
        return result;
      },

      // 인증 상태 초기화 (앱 시작시)
      initAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = parseToken(token);
          if (payload && payload.exp * 1000 > Date.now()) {
            // 토큰에서 기본 사용자 정보 설정 (role 포함)
            const tokenRole = payload.role || 'USER';
            const userFromToken = {
              id: payload.userId || payload.sub,
              email: payload.email || payload.sub,
              name: payload.name || '사용자',
              role: tokenRole,
            };

            set({ isAuthenticated: true, token, currentUser: userFromToken });

            // API로 상세 정보 조회 시도 (role은 토큰 값 유지)
            if (payload.sub) {
              const result = await get().fetchCurrentUser(payload.sub);
              // fetchCurrentUser가 role을 보존하므로 별도 처리 불필요
              if (!result?.success) {
                set({ currentUser: userFromToken });
              }
            }
          } else {
            // 토큰 만료 - 모든 저장소 초기화
            localStorage.removeItem('token');
            localStorage.removeItem('user-storage');
            localStorage.removeItem('cart-storage');
            set({ isAuthenticated: false, token: null, currentUser: null });
          }
        }
      },

      // 전체 사용자 조회
      fetchUsers: async () => {
        set({ loading: true, error: null });
        const result = await userApi.getAll();

        if (result.success) {
          set({ users: result.data, loading: false });
        } else {
          set({ error: result.error, loading: false });
        }
      },

      // 사용자 생성
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

      // 사용자 삭제
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
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        currentUser: state.currentUser,
        isAdminMode: state.isAdminMode,
      }),
    }
  )
);
