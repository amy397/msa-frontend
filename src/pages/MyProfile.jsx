import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function MyProfile() {
  const navigate = useNavigate();
  const { user, userId, userEmail, isAuthenticated, loading, error, fetchMyProfile } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyProfile();
  }, [isAuthenticated, navigate, fetchMyProfile]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-red-500 p-4 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">내 정보</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {user ? (
          <div className="space-y-4">
            <div className="flex border-b pb-3">
              <span className="w-24 text-gray-500">이름</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex border-b pb-3">
              <span className="w-24 text-gray-500">이메일</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex border-b pb-3">
                <span className="w-24 text-gray-500">전화번호</span>
                <span className="font-medium">{user.phone}</span>
              </div>
            )}
            {user.createdAt && (
              <div className="flex border-b pb-3">
                <span className="w-24 text-gray-500">가입일</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>사용자 정보를 불러올 수 없습니다.</p>
            <p className="text-sm mt-2">User ID: {userId}</p>
            <p className="text-sm">Email: {userEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
