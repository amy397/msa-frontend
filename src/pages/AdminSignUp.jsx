import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

export default function AdminSignUp() {
  const navigate = useNavigate();
  const { signUp, login, setAdminMode, loading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    adminCode: '',
  });
  const [error, setError] = useState('');

  // 관리자 인증 코드 (실제 환경에서는 환경변수로 관리)
  const ADMIN_SECRET_CODE = 'ADMIN2024';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 관리자 코드 검증
    if (formData.adminCode !== ADMIN_SECRET_CODE) {
      setError('관리자 인증 코드가 올바르지 않습니다.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 회원가입 요청 (관리자 role 포함)
    const signUpResult = await signUp({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      role: 'ADMIN',
    });

    if (signUpResult.success) {
      // 회원가입 성공 후 자동 로그인
      const loginResult = await login({
        email: formData.email,
        password: formData.password,
      });

      if (loginResult.success) {
        // 관리자 모드 활성화
        setAdminMode(true);
        alert('관리자 계정이 생성되었습니다!');
        navigate('/');
      } else {
        // 로그인 실패 시 로그인 페이지로 이동
        alert('회원가입 완료! 로그인 페이지에서 로그인 후 관리자 모드를 활성화하세요.');
        navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-2">
            관리자 전용
          </span>
          <h2 className="text-2xl font-bold">관리자 회원가입</h2>
          <p className="text-gray-500 text-sm mt-2">
            관리자 코드가 있는 분만 가입할 수 있습니다.
          </p>
        </div>

        {(error || authError) && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리자 인증 코드 *
            </label>
            <input
              type="password"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="관리자 인증 코드 입력"
            />
            <p className="text-xs text-gray-500 mt-1">
              테스트용 코드: ADMIN2024
            </p>
          </div>

          <hr className="my-4" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="비밀번호"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="비밀번호 확인"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="010-1234-5678"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-300"
          >
            {loading ? '처리 중...' : '관리자로 가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
          <p>
            일반 회원이신가요?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              일반 회원가입
            </Link>
          </p>
          <p>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
