import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useUser';
import { paymentApi } from '../api/paymentApi';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items, navigate]);

  const handlePayment = async () => {
    if (!window.TossPayments) {
      alert('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!currentUser?.id) {
      setError('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 주문 생성
      const orderData = {
        userId: currentUser.id,
        orderItems: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      };

      const result = await paymentApi.preparePayment(orderData);

      if (!result.success) {
        throw new Error(result.error || '주문 생성에 실패했습니다.');
      }

      const order = result.data;
      const orderId = order.id || order.orderId || `ORDER_${Date.now()}`;

      // 2. 토스 결제창 호출
      const tossPayments = window.TossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);

      await tossPayments.requestPayment('카드', {
        amount: totalAmount,
        orderId: String(orderId),
        orderName: items.length > 1
          ? `${items[0].name} 외 ${items.length - 1}건`
          : items[0].name,
        customerName: currentUser.name || '고객',
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });

    } catch (err) {
      console.error('결제 에러:', err);
      if (err.code === 'USER_CANCEL') {
        setError('결제가 취소되었습니다.');
      } else {
        setError(err.message || '결제 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">주문/결제</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* 주문 상품 목록 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">주문 상품 ({items.length}개)</h2>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                이미지
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-blue-600 font-bold">
                  {Number(item.price).toLocaleString()}원
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="w-24 text-right font-bold">
                {(item.price * item.quantity).toLocaleString()}원
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 주문자 정보 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <h2 className="font-bold text-lg mb-4">주문자 정보</h2>
        <div className="space-y-2 text-gray-600">
          <p>이름: {currentUser?.name || '-'}</p>
          <p>이메일: {currentUser?.email || '-'}</p>
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <h2 className="font-bold text-lg mb-4">결제 금액</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>상품 금액</span>
            <span>{totalAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>배송비</span>
            <span>무료</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-xl font-bold">
            <span>총 결제 금액</span>
            <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={loading || !currentUser?.id}
        className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {loading ? '처리 중...' : !currentUser?.id ? '사용자 정보 로딩 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
      </button>
    </div>
  );
}
