import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

export default function AdminSignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, setAdminMode, isAdminMode } = useAuth();
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  // 관리자 인증 코드 (실제 환경에서는 환경변수로 관리)
  const ADMIN_SECRET_CODE = 'ADMIN2024';

  // 로그인 안 된 상태면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/signup' } });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError('로그인이 필요합니다.');
      return;
    }

    if (adminCode !== ADMIN_SECRET_CODE) {
      setError('관리자 인증 코드가 올바르지 않습니다.');
      return;
    }

    // 관리자 모드 활성화
    setAdminMode(true);
    alert('관리자 모드가 활성화되었습니다!');
    navigate('/');
  };

  const handleDisableAdmin = () => {
    setAdminMode(false);
    alert('관리자 모드가 비활성화되었습니다.');
    navigate('/');
  };

  // 로그인 안 된 상태
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-4">
            관리자 모드를 활성화하려면 먼저 로그인해주세요.
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  // 이미 관리자 모드인 경우
  if (isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-2xl font-bold mb-2">관리자 모드 활성화됨</h2>
          <p className="text-gray-500 mb-4">{currentUser?.name}님</p>
          <p className="text-gray-600 mb-6">
            상품관리, 회원관리 메뉴를 이용할 수 있습니다.
          </p>
          <button
            onClick={handleDisableAdmin}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            관리자 모드 해제
          </button>
          <Link
            to="/"
            className="block mt-4 text-blue-600 hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 관리자 모드 활성화 폼
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-2">
            관리자 전용
          </span>
          <h2 className="text-2xl font-bold">관리자 모드 활성화</h2>
          <p className="text-gray-500 text-sm mt-2">
            {currentUser?.name}님, 관리자 인증 코드를 입력하세요.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리자 인증 코드
            </label>
            <input
              type="password"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setError('');
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="관리자 인증 코드 입력"
            />
            <p className="text-xs text-gray-500 mt-1">
              테스트용 코드: ADMIN2024
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            관리자 모드 활성화
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/" className="text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
