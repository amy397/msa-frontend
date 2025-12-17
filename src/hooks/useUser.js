import { useUserStore } from '../stores/userStore';

export const useAuth = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.currentUser);
  const token = useUserStore((state) => state.token);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const signUp = useUserStore((state) => state.signUp);
  const adminSignUp = useUserStore((state) => state.adminSignUp);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const initAuth = useUserStore((state) => state.initAuth);
  const clearError = useUserStore((state) => state.clearError);

  // 테스트용 관리자 모드
  const isAdminMode = useUserStore((state) => state.isAdminMode);
  const setAdminMode = useUserStore((state) => state.setAdminMode);

  // 관리자 여부 (로그인 + (테스트 모드 또는 실제 role))
  const isAdmin = isAuthenticated && (isAdminMode || currentUser?.role === 'ADMIN');

  return {
    isAuthenticated,
    currentUser,
    token,
    loading,
    error,
    signUp,
    adminSignUp,
    login,
    logout,
    initAuth,
    clearError,
    isAdminMode,
    setAdminMode,
    isAdmin,
  };
};

export const useUsers = () => {
  const users = useUserStore((state) => state.users);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const createUser = useUserStore((state) => state.createUser);
  const deleteUser = useUserStore((state) => state.deleteUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  const clearError = useUserStore((state) => state.clearError);

  return {
    users,
    loading,
    error,
    selectedUser,
    fetchUsers,
    createUser,
    deleteUser,
    setSelectedUser,
    clearError,
  };
};
