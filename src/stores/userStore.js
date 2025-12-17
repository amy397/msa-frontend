import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userApi } from '../api/userApi';

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
        set({ loading: true, error: null, currentUser: null });  // 이전 사용자 정보 초기화
        const result = await userApi.login(data);

        console.log('🔍 로그인 응답 전체:', JSON.stringify(result, null, 2));

        if (result.success) {
          const { accessToken, user } = result.data;
          console.log('🔍 user 필드:', user);
          localStorage.setItem('token', accessToken);

          // 로그인 응답에 user 정보가 있으면 바로 사용
          if (user) {
            set({
              isAuthenticated: true,
              token: accessToken,
              currentUser: user,
              loading: false,
            });
          } else {
            // user 정보가 없으면 토큰에서 파싱
            const payload = parseToken(accessToken);
            console.log('🔍 JWT payload:', payload);

            const email = payload?.sub;

            // API로 사용자 정보 조회 시도
            let userFound = false;
            if (email) {
              const result = await userApi.getByEmail(email);
              if (result.success) {
                set({
                  isAuthenticated: true,
                  token: accessToken,
                  currentUser: result.data,
                  loading: false,
                });
                userFound = true;
              }
            }

            // API 실패 시 토큰에서 최소한의 사용자 정보 생성
            if (!userFound) {
              console.log('⚠️ API 조회 실패, 토큰에서 사용자 정보 생성');
              const tempUser = {
                id: payload?.userId || payload?.id || 0,
                email: email || '',
                name: payload?.name || email?.split('@')[0] || '사용자',
                role: payload?.role || 'USER',
              };
              set({
                isAuthenticated: true,
                token: accessToken,
                currentUser: tempUser,
                loading: false,
              });
            }
          }
        } else {
          set({ error: result.error, loading: false });
        }
        return result;
      },

      // 로그아웃
      logout: () => {
        localStorage.removeItem('token');
        set({
          isAuthenticated: false,
          currentUser: null,
          token: null,
          isAdminMode: false,
        });
      },

      // 관리자 모드 설정 (테스트용)
      setAdminMode: (value) => set({ isAdminMode: value }),

      // 현재 사용자 정보 조회 (ID로)
      fetchCurrentUser: async (id) => {
        const result = await userApi.getById(id);
        if (result.success) {
          set({ currentUser: result.data });
        }
        return result;
      },

      // 현재 사용자 정보 조회 (이메일로)
      fetchCurrentUserByEmail: async (email) => {
        const result = await userApi.getByEmail(email);
        if (result.success) {
          set({ currentUser: result.data });
        }
        return result;
      },

      // 인증 상태 초기화 (앱 시작시)
      initAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = parseToken(token);
          if (payload && payload.exp * 1000 > Date.now()) {
            // 토큰 유효 - persist된 currentUser 사용 (API 호출 안함)
            set({ isAuthenticated: true, token });
          } else {
            // 토큰 만료
            localStorage.removeItem('token');
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
