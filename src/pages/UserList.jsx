import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useUsers } from '../hooks/useUser';

function UserList() {
  const navigate = useNavigate();
  const { isAuthenticated, userRole } = useAuthStore();
  const { users, loading, error, fetchUsers, deleteUser } = useUsers();

  const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // 관리자만 목록 조회 시도
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, navigate, fetchUsers]);

  if (!isAuthenticated) {
    return null;
  }

  // 관리자가 아닌 경우
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          <p className="font-medium">관리자 권한이 필요합니다.</p>
          <p className="text-sm mt-2">이 페이지는 관리자만 접근할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-center p-4">로딩중...</div>;

  // API가 없는 경우 안내 메시지
  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">회원 관리 (관리자)</h1>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
          <p className="font-medium">백엔드 API 준비 필요</p>
          <p className="text-sm mt-2">
            전체 회원 조회 API (GET /api/users)가 백엔드에 구현되어야 합니다.
          </p>
          <p className="text-sm mt-1">
            UserController에 다음 API를 추가해주세요:
          </p>
          <code className="block bg-blue-200 p-2 mt-2 rounded text-xs">
            @GetMapping<br/>
            public ResponseEntity&lt;List&lt;UserResponse&gt;&gt; getAllUsers()
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">회원 관리 (관리자)</h1>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <div className="text-gray-500 text-center p-4">등록된 회원이 없습니다.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.role && (
                  <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserList;
