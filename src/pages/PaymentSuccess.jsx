import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { paymentApi } from '../api/paymentApi';
import { useCart } from '../hooks/useCart';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const confirmPayment = async () => {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.');
        setStatus('error');
        return;
      }

      try {
        // 결제 승인 API 호출
        const result = await paymentApi.confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        if (result.success) {
          setOrderInfo({
            orderId,
            amount: Number(amount),
          });
          setStatus('success');
          clearCart();
        } else {
          throw new Error(result.error || '결제 승인에 실패했습니다.');
        }
      } catch (err) {
        console.error('결제 승인 에러:', err);
        setError(err.message || '결제 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    confirmPayment();
  }, [searchParams, clearCart]);

  if (status === 'processing') {
    return (
      <div className="container mx-auto p-6 max-w-lg">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-xl font-bold mb-2">결제 처리 중...</h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container mx-auto p-6 max-w-lg">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-red-600">!</span>
          </div>
          <h1 className="text-xl font-bold mb-2 text-red-600">결제 승인 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2">
            <Link
              to="/checkout"
              className="block w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              다시 결제하기
            </Link>
            <Link
              to="/products"
              className="block w-full bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-green-600">&#10003;</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">결제 완료!</h1>
        <p className="text-gray-600 mb-6">주문이 성공적으로 완료되었습니다.</p>

        {orderInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">주문번호</span>
              <span className="font-medium">{orderInfo.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제금액</span>
              <span className="font-bold text-blue-600">
                {orderInfo.amount.toLocaleString()}원
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Link
            to="/orders"
            className="block w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            주문내역 보기
          </Link>
          <Link
            to="/products"
            className="block w-full bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  );
}
