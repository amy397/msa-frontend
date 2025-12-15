import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MSA Shop
        </Link>

        <div className="flex items-center gap-6">
          {/* 모든 사용자 - 상품 목록 */}
          <Link to="/products" className="hover:text-blue-200">
            상품
          </Link>

          {/* 관리자 전용 메뉴 */}
          {isAdmin && (
            <>
              <Link to="/admin/products" className="hover:text-blue-200">
                상품관리
              </Link>
              <Link to="/admin/users" className="hover:text-blue-200">
                회원관리
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/mypage"
                className="text-sm bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded flex items-center gap-1"
              >
                {isAdmin && (
                  <span className="bg-purple-500 text-xs px-1 rounded">관리자</span>
                )}
                {currentUser?.name || '사용자'}님
              </Link>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-100 px-3 py-1 rounded text-sm"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
