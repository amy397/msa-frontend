import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function MyProfile() {
  const navigate = useNavigate();
  const { userEmail, userRole, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">내 정보</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div className="flex border-b pb-3">
            <span className="w-24 text-gray-500">이메일</span>
            <span className="font-medium">{userEmail}</span>
          </div>
          <div className="flex border-b pb-3">
            <span className="w-24 text-gray-500">권한</span>
            <span className={`inline-block text-sm px-2 py-1 rounded ${
              userRole === 'ADMIN' || userRole === 'ROLE_ADMIN'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {userRole === 'ADMIN' || userRole === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p>* 추가 정보(이름, 전화번호 등)를 표시하려면 백엔드에 <code className="bg-gray-200 px-1 rounded">/api/users/me</code> API가 필요합니다.</p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
