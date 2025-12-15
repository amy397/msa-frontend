import { useUserStore } from '../stores/userStore';

export const useAuth = () => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const currentUser = useUserStore((state) => state.currentUser);
  const token = useUserStore((state) => state.token);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const signUp = useUserStore((state) => state.signUp);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const initAuth = useUserStore((state) => state.initAuth);
  const clearError = useUserStore((state) => state.clearError);

  return {
    isAuthenticated,
    currentUser,
    token,
    loading,
    error,
    signUp,
    login,
    logout,
    initAuth,
    clearError,
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
