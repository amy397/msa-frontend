import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/orders" element={<OrderList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </RecoilRoot>
  );
}

// 홈 페이지
function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center">🛒 MSA Shop</h1>
      <p className="text-center text-gray-600 mt-4">회원 / 상품 / 주문 관리 시스템</p>
    </div>
  );
}

export default App;
