import { useUserStore } from '../stores/userStore';

export const useUsers = () => {
  const users = useUserStore((state) => state.users);
  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const createUser = useUserStore((state) => state.createUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
  };
};
