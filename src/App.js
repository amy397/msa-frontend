import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import ProductAdmin from './pages/ProductAdmin';
import ProductShop from './pages/ProductShop';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useUserStore } from './stores/userStore';

function App() {
  const initAuth = useUserStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mypage" element={<MyPage />} />

          {/* 일반 사용자 - 상품 조회/구매 */}
          <Route path="/products" element={<ProductShop />} />

          {/* 관리자 전용 */}
          <Route path="/admin/products" element={<ProductAdmin />} />
          <Route path="/admin/users" element={<UserList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">MSA Shop</h1>
      <p className="text-center text-gray-600 mt-4">
        온라인 쇼핑몰에 오신 것을 환영합니다
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 max-w-2xl mx-auto">
        <Link
          to="/products"
          className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">🛍️</div>
          <h2 className="text-xl font-bold mb-2">상품 둘러보기</h2>
          <p className="text-gray-600">다양한 상품을 구경하고 구매하세요</p>
        </Link>

        <Link
          to="/signup"
          className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow"
        >
          <div className="text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold mb-2">회원가입</h2>
          <p className="text-gray-600">회원이 되어 다양한 혜택을 누리세요</p>
        </Link>
      </div>
    </div>
  );
}

export default App;
