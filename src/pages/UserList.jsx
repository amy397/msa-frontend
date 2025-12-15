import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers, useAuth } from '../hooks/useUser';

function UserList() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { users, loading, error, fetchUsers, deleteUser, clearError } = useUsers();

  useEffect(() => {
    // 로그인 체크
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // 관리자 체크
    if (currentUser && currentUser.role !== 'ADMIN') {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [isAuthenticated, currentUser]);

  // 관리자 아니면 렌더링하지 않음
  if (!isAuthenticated || currentUser?.role !== 'ADMIN') {
    return null;
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`${name}님을 정말 삭제하시겠습니까?`)) {
      await deleteUser(id);
    }
  };

  const roleLabel = (role) => {
    return role === 'ADMIN' ? '관리자' : '일반회원';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">회원 관리</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="hover:underline">
            닫기
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">등록된 회원이 없습니다.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  전화번호
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  권한
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  가입일
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {roleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('ko-KR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={user.id === currentUser?.id}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        총 {users.length}명의 회원
      </div>
    </div>
  );
}

export default UserList;
