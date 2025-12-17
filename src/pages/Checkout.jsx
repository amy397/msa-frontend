import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useUser';
import { paymentApi } from '../api/paymentApi';
import { orderApi } from '../api/orderApi';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart, updateQuantity, removeItem } = useCart();
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
    if (!currentUser) {
      alert('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 주문 생성
      const orderData = {
        userId: currentUser.id,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      };

      const orderResult = await orderApi.create(orderData);
      if (!orderResult.success) {
        throw new Error(orderResult.error || '주문 생성에 실패했습니다.');
      }

      const orderId = orderResult.data.id;
      const orderName = items.length > 1
        ? `${items[0].name} 외 ${items.length - 1}건`
        : items[0].name;

      // 2. Toss Payments 결제창 호출
      const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error('결제 설정이 올바르지 않습니다.');
      }

      // eslint-disable-next-line no-undef
      const tossPayments = TossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: `user_${currentUser.id}` });

      await payment.requestPayment({
        method: 'CARD',
        amount: {
          value: totalAmount,
          currency: 'KRW',
        },
        orderId: `order_${orderId}_${Date.now()}`,
        orderName,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    } catch (err) {
      console.error('결제 오류:', err);
      setError(err.message || '결제 처리 중 오류가 발생했습니다.');
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
          <h2 className="text-lg font-bold">주문 상품</h2>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-sm">
                이미지
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-blue-600 font-bold">
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
                  className="text-red-500 text-sm hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주문자 정보 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">주문자 정보</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">이름</label>
              <p className="font-medium">{currentUser?.name || '-'}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">이메일</label>
              <p className="font-medium">{currentUser?.email || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">결제 금액</h2>
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
            <span>총 결제 금액</span>
            <span className="text-blue-600">{totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 결제 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/products')}
          className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
        >
          쇼핑 계속하기
        </button>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '결제 처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
        </button>
      </div>
    </div>
  );
}
