import { useAuth } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function MyPage() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">로딩 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10 text-gray-500">
          사용자 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const roleLabel = currentUser.role === 'ADMIN' ? '관리자' : '일반 회원';

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl text-blue-600 font-bold">
            {currentUser.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            <span
              className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                currentUser.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {roleLabel}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <label className="text-sm text-gray-500">이메일</label>
            <p className="text-lg">{currentUser.email}</p>
          </div>

          <div className="border-b pb-4">
            <label className="text-sm text-gray-500">이름</label>
            <p className="text-lg">{currentUser.name}</p>
          </div>

          <div className="border-b pb-4">
            <label className="text-sm text-gray-500">전화번호</label>
            <p className="text-lg">{currentUser.phone || '등록되지 않음'}</p>
          </div>

          <div className="border-b pb-4">
            <label className="text-sm text-gray-500">가입일</label>
            <p className="text-lg">
              {currentUser.createdAt
                ? new Date(currentUser.createdAt).toLocaleDateString('ko-KR')
                : '-'}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-500">권한</label>
            <p className="text-lg">{roleLabel}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button
            onClick={() => alert('회원정보 수정 기능은 추후 구현 예정입니다.')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            회원정보 수정
          </button>
        </div>
      </div>
    </div>
  );
}
