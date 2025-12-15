import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

export default function AdminSignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, setAdminMode, isAdminMode } = useAuth();
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');

  // 관리자 인증 코드 (실제 환경에서는 환경변수로 관리)
  const ADMIN_SECRET_CODE = 'ADMIN2024';

  const handleSubmit = (e) => {
    e.preventDefault();

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

  // 이미 관리자 모드인 경우
  if (isAdminMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-2xl font-bold mb-4">관리자 모드 활성화됨</h2>
          <p className="text-gray-600 mb-6">
            현재 관리자 모드로 로그인되어 있습니다.<br />
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-2">
            관리자 전용
          </span>
          <h2 className="text-2xl font-bold">관리자 모드 활성화</h2>
          <p className="text-gray-500 text-sm mt-2">
            관리자 인증 코드를 입력하면<br />
            상품관리, 회원관리 기능을 사용할 수 있습니다.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
            먼저 로그인이 필요합니다.{' '}
            <Link to="/login" className="underline font-medium">
              로그인하기
            </Link>
          </div>
        )}

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
