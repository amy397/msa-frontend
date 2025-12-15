import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
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
          <Route path="/users" element={<UserList />} />
          <Route path="/products" element={<ProductList />} />
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
        회원 / 상품 / 주문 관리 시스템
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-2">회원 관리</h2>
          <p className="text-gray-600">회원 목록 조회 및 관리</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-2">상품 관리</h2>
          <p className="text-gray-600">상품 등록, 수정, 삭제, 재고 관리</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-2">주문 관리</h2>
          <p className="text-gray-600">주문 내역 조회 및 관리</p>
        </div>
      </div>
    </div>
  );
}

export default App;
