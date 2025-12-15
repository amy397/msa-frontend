import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

export default function AdminSignUp() {
  const navigate = useNavigate();
  const { signUp, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    adminCode: '', // 관리자 인증 코드
  });
  const [validationError, setValidationError] = useState('');

  // 관리자 인증 코드 (실제 환경에서는 환경변수로 관리)
  const ADMIN_SECRET_CODE = 'ADMIN2024';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (validationError) setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 관리자 코드 확인
    if (formData.adminCode !== ADMIN_SECRET_CODE) {
      setValidationError('관리자 인증 코드가 올바르지 않습니다.');
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 8) {
      setValidationError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    const { passwordConfirm, adminCode, ...signUpData } = formData;
    // role을 ADMIN으로 설정
    const result = await signUp({ ...signUpData, role: 'ADMIN' });

    if (result.success) {
      alert('관리자 계정이 생성되었습니다. 로그인해주세요.');
      navigate('/login');
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
        </div>

        {(error || validationError) && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리자 인증 코드 <span className="text-red-500">*</span>
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
              관리자 인증 코드는 시스템 관리자에게 문의하세요
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일 <span className="text-red-500">*</span>
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
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="8자 이상 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="비밀번호 재입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="관리자 이름"
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
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
          >
            {loading ? '가입 중...' : '관리자 계정 생성'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          일반 회원이신가요?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            일반 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
