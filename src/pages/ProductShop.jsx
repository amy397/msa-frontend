import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useUser';
import { useCart } from '../hooks/useCart';

const STATUS_LABELS = {
  AVAILABLE: '판매중',
  OUT_OF_STOCK: '품절',
  DISCONTINUED: '판매중단',
};

export default function ProductShop() {
  const navigate = useNavigate();
  const {
    products,
    loading,
    error,
    fetchAvailableProducts,
    searchProducts,
    clearError,
  } = useProducts();

  const { isAuthenticated } = useAuth();
  const { items: cart, addItem, totalAmount, totalCount } = useCart();
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchAvailableProducts();
  }, []);

  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      await searchProducts(searchKeyword);
    } else {
      await fetchAvailableProducts();
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    addItem(product);
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="hover:underline">
            닫기
          </button>
        </div>
      )}

      {/* 검색 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="상품명 검색..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            검색
          </button>
          <button
            onClick={() => {
              setSearchKeyword('');
              fetchAvailableProducts();
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 장바구니 요약 */}
      {totalCount > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center">
            <span className="font-bold">
              장바구니: {totalCount}개 상품, 총 {totalAmount.toLocaleString()}원
            </span>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              주문하기
            </button>
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      {loading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              <div className="h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                상품 이미지
              </div>

              <h3 className="font-bold text-lg mb-1">{product.name}</h3>

              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                  {product.category}
                </span>
              )}

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description || '설명 없음'}
              </p>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-blue-600">
                  {Number(product.price).toLocaleString()}원
                </span>
                <span
                  className={`text-sm ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock > 0 ? `재고 ${product.stock}` : '품절'}
                </span>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.stock > 0 ? '장바구니 담기' : '품절'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
