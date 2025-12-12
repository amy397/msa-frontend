import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/orders" element={<OrderList />} />
        </Routes>
      </div>
    </BrowserRouter>
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
