import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          🛒 MSA Shop
        </Link>
        <div className="flex gap-6">
          <Link to="/users" className="hover:text-blue-200">회원관리</Link>
          <Link to="/products" className="hover:text-blue-200">상품관리</Link>
          <Link to="/orders" className="hover:text-blue-200">주문관리</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;