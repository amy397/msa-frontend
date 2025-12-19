import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';
import { useCart } from '../hooks/useCart';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, isAdmin, isAdminMode } = useAuth();
  const { totalCount, clearCart } = useCart();

  const handleLogout = () => {
    clearCart();  // 로그아웃 시 장바구니 비우기
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

          {isAuthenticated && (
            <>
              <Link to="/checkout" className="hover:text-blue-200 relative">
                장바구니
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hover:text-blue-200">
                주문내역
              </Link>
            </>
          )}

          {/* 관리자 전용 메뉴 */}
          {isAdmin && (
            <>
              <Link to="/admin/orders" className="hover:text-blue-200">
                주문관리
              </Link>
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
                  <span className={`text-xs px-1 rounded ${isAdminMode ? 'bg-orange-500' : 'bg-purple-500'}`}>
                    {isAdminMode ? '테스트' : '관리자'}
                  </span>
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
