import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useUser';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalAmount, totalCount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">장바구니</h1>
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 mb-6">장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            상품 둘러보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      {/* 장바구니 상품 목록 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">장바구니 상품 ({totalCount}개)</h2>
          <button
            onClick={clearCart}
            className="text-red-500 text-sm hover:underline"
          >
            전체 삭제
          </button>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                  이미지
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                {item.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    {item.category}
                  </span>
                )}
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <p className="text-blue-600 font-bold mt-1">
                  {Number(item.price).toLocaleString()}원
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded border hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-10 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded border hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="font-bold">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm hover:underline mt-1"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 금액 요약 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">주문 요약</h2>
        </div>
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <span>상품 금액</span>
            <span>{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>배송비</span>
            <span>무료</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-xl font-bold">
            <span>총 금액</span>
            <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/products')}
          className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
        >
          쇼핑 계속하기
        </button>
        <button
          onClick={() => navigate('/checkout')}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          주문하기
        </button>
      </div>
    </div>
  );
}
