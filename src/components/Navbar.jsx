import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

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
          <Link to="/products" className="hover:text-blue-200">
            상품관리
          </Link>
          <Link to="/users" className="hover:text-blue-200">
            회원관리
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm bg-blue-500 px-3 py-1 rounded">
                {currentUser?.name || currentUser?.email || '사용자'}님
              </span>
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
