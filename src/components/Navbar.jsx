import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

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
        <div className="flex gap-6 items-center">
          <Link to="/users" className="hover:text-blue-200">회원관리</Link>
          <Link to="/products" className="hover:text-blue-200">상품관리</Link>
          <Link to="/orders" className="hover:text-blue-200">주문관리</Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              로그아웃
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-blue-500 hover:bg-blue-700 border border-white px-4 py-2 rounded"
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
