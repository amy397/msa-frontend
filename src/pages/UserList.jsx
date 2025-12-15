import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

function UserList() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, isAdmin, isAdminMode } = useAuth();

  useEffect(() => {
    // 로그인 체크
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // 관리자 체크 (실제 role 또는 테스트 모드)
    if (!isAdmin) {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // 관리자 아니면 렌더링하지 않음
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const roleLabel = (role) => {
    return role === 'ADMIN' ? '관리자' : '일반회원';
  };

  // 현재 사용자를 배열로 변환 (테이블 재사용)
  const users = currentUser ? [currentUser] : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">회원 관리</h1>

      {/* 안내 메시지 */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-6">
        <p className="font-medium">안내</p>
        <p className="text-sm mt-1">
          현재 백엔드 API에서 전체 회원 목록 조회를 지원하지 않습니다.
          {isAdminMode && ' (테스트 관리자 모드)'}
        </p>
      </div>

      {/* 현재 로그인 사용자 정보 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">내 계정 정보</h2>
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">사용자 정보를 불러올 수 없습니다.</div>
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
                      {isAdminMode && (
                        <span className="ml-2 px-2 py-1 rounded text-xs bg-orange-100 text-orange-800">
                          테스트 모드
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('ko-KR')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        총 {users.length}명의 회원 정보 표시
      </div>
    </div>
  );
}

export default UserList;
