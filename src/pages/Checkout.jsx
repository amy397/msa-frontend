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
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'bank'
  const [showBankInfo, setShowBankInfo] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: '',
    phone: '',
    zipCode: '',
    address: '',
    addressDetail: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length === 0 && !showBankInfo) {
      navigate('/products');
    }
  }, [items, navigate, showBankInfo]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingAddress = () => {
    const { recipientName, phone, address } = shippingAddress;
    if (!recipientName.trim()) {
      setError('수령인 이름을 입력해주세요.');
      return false;
    }
    if (!phone.trim()) {
      setError('연락처를 입력해주세요.');
      return false;
    }
    if (!address.trim()) {
      setError('배송지 주소를 입력해주세요.');
      return false;
    }
    return true;
  };

  // 무통장입금 처리
  const handleBankTransfer = async () => {
    if (!currentUser) {
      alert('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    if (!validateShippingAddress()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: currentUser.id,
        email: currentUser.email,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          productImageUrl: item.imageUrl || '',
        })),
        totalAmount,
        shippingAddress,
        paymentMethod: 'BANK_TRANSFER',
        status: 'PENDING_PAYMENT',
      };

      const orderResult = await orderApi.create(orderData);
      if (!orderResult.success) {
        throw new Error(orderResult.error || '주문 생성에 실패했습니다.');
      }

      setShowBankInfo(true);
    } catch (err) {
      console.error('주문 오류:', err);
      setError(err.message || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 카드 결제 처리
  const handleCardPayment = async () => {
    if (!currentUser) {
      alert('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    if (!validateShippingAddress()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: currentUser.id,
        email: currentUser.email,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          productImageUrl: item.imageUrl || '',
        })),
        totalAmount,
        shippingAddress,
      };

      const orderResult = await orderApi.create(orderData);
      if (!orderResult.success) {
        throw new Error(orderResult.error || '주문 생성에 실패했습니다.');
      }

      const orderId = orderResult.data.id;
      const orderName = items.length > 1
        ? `${items[0].name} 외 ${items.length - 1}건`
        : items[0].name;

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

  const handlePayment = () => {
    if (paymentMethod === 'bank') {
      handleBankTransfer();
    } else {
      handleCardPayment();
    }
  };

  // 장바구니가 비었는데 무통장입금 모달도 안보이면 상품 페이지로
  if (items.length === 0 && !showBankInfo) {
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
<<<<<<< HEAD
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
=======
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">이미지</span>
                )}
              </div>
>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995
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

      {/* 배송지 정보 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">배송지 정보</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                수령인 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="recipientName"
                value={shippingAddress.recipientName}
                onChange={handleShippingChange}
                placeholder="수령인 이름"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={shippingAddress.phone}
                onChange={handleShippingChange}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">우편번호</label>
            <input
              type="text"
              name="zipCode"
              value={shippingAddress.zipCode}
              onChange={handleShippingChange}
              placeholder="우편번호"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              placeholder="기본 주소"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">상세 주소</label>
            <input
              type="text"
              name="addressDetail"
              value={shippingAddress.addressDetail}
              onChange={handleShippingChange}
              placeholder="상세 주소 (동/호수 등)"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

      {/* 결제 수단 선택 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">결제 수단</h2>
        </div>
        <div className="p-4 flex gap-4">
          <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <span className="font-medium">카드 결제</span>
            <p className="text-sm text-gray-500 mt-1">토스페이먼츠</p>
          </label>
          <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            <span className="font-medium">무통장입금</span>
            <p className="text-sm text-gray-500 mt-1">테스트용</p>
          </label>
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
          {loading ? '처리 중...' : paymentMethod === 'bank' ? '주문하기' : `${totalAmount.toLocaleString()}원 결제하기`}
        </button>
      </div>

      {/* 무통장입금 안내 모달 */}
      {showBankInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">주문이 완료되었습니다!</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">무통장입금 계좌 정보</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">은행:</span> <span className="font-medium">테스트은행</span></p>
                <p><span className="text-gray-600">계좌번호:</span> <span className="font-medium">123-456-789012</span></p>
                <p><span className="text-gray-600">예금주:</span> <span className="font-medium">테스트샵</span></p>
                <p><span className="text-gray-600">입금금액:</span> <span className="font-bold text-blue-600">{totalAmount.toLocaleString()}원</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center">
              위 계좌로 입금해주시면 주문이 확정됩니다.<br/>
              (테스트용이므로 실제 입금은 필요 없습니다)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { clearCart(); navigate('/orders'); }}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                주문내역 보기
              </button>
              <button
                onClick={() => { clearCart(); navigate('/products'); }}
                className="flex-1 py-2 border rounded hover:bg-gray-50"
              >
                쇼핑 계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
