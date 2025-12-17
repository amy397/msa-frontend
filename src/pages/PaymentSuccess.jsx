import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import { useCart } from '../hooks/useCart';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setStatus('error');
        setError('결제 정보가 올바르지 않습니다.');
        return;
      }

      try {
        const result = await paymentApi.confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        if (result.success) {
          clearCart();
          setStatus('success');
        } else {
          setStatus('error');
          setError(result.error || '결제 승인에 실패했습니다.');
        }
      } catch (err) {
        setStatus('error');
        setError('결제 처리 중 오류가 발생했습니다.');
      }
    };

    confirmPayment();
  }, [paymentKey, orderId, amount, clearCart]);

  if (status === 'processing') {
    return (
      <div className="container mx-auto p-6 max-w-lg text-center">
        <div className="bg-white rounded-lg shadow p-10">
          <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-xl font-bold mb-2">결제 확인 중</h1>
          <p className="text-gray-600">잠시만 기다려 주세요...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto p-6 max-w-lg text-center">
        <div className="bg-white rounded-lg shadow p-10">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2 text-red-600">결제 승인 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-lg text-center">
      <div className="bg-white rounded-lg shadow p-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">결제가 완료되었습니다</h1>
        <p className="text-gray-600 mb-6">
          주문이 성공적으로 처리되었습니다.
          <br />
          주문 내역에서 상세 정보를 확인하세요.
        </p>

        <div className="bg-gray-50 rounded p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">주문번호</span>
            <span className="font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">결제금액</span>
            <span className="font-bold text-blue-600">
              {Number(amount).toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 py-2 border rounded hover:bg-gray-50"
          >
            주문 내역 보기
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
}
