javascriptimport { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { usersState, usersLoadingState, usersErrorState } from '../recoil/userState';
import { userApi } from '../api/userApi';

export const useUsers = () => {
  const [users, setUsers] = useRecoilState(usersState);
  const [loading, setLoading] = useRecoilState(usersLoadingState);
  const [error, setError] = useRecoilState(usersErrorState);

  // 전체 조회
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await userApi.getAll();
    
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  }, [setUsers, setLoading, setError]);

  // 생성
  const createUser = useCallback(async (data) => {
    setLoading(true);
    
    const result = await userApi.create(data);
    
    if (result.success) {
      await fetchUsers();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [fetchUsers, setLoading, setError]);

  // 삭제
  const deleteUser = useCallback(async (id) => {
    setLoading(true);
    
    const result = await userApi.delete(id);
    
    if (result.success) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [setUsers, setLoading, setError]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
  };
};