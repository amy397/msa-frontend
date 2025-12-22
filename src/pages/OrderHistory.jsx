import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';
import { orderApi } from '../api/orderApi';

const STATUS_LABELS = {
  // 주문 대기
  PENDING: '주문 대기',
  PENDING_PAYMENT: '입금 대기',
  WAITING: '주문 대기',
  // 결제 완료
  PAID: '결제 완료',
  CONFIRMED: '주문 확인',
  PAYMENT_COMPLETED: '결제 완료',
  // 준비중
  PREPARING: '상품 준비중',
  PROCESSING: '처리중',
  IN_PROGRESS: '진행중',
  // 배송
  SHIPPING: '배송중',
  SHIPPED: '배송중',
  IN_DELIVERY: '배송중',
  // 완료
  DELIVERED: '배송 완료',
  COMPLETED: '주문 완료',
  DONE: '완료',
  // 취소
  CANCELLED: '주문 취소',
  CANCELED: '주문 취소',
  REFUNDED: '환불 완료',
  FAILED: '주문 실패',
};

const STATUS_COLORS = {
  // 대기
  PENDING: 'bg-yellow-100 text-yellow-800',
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
  WAITING: 'bg-yellow-100 text-yellow-800',
  // 결제/확인
  PAID: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PAYMENT_COMPLETED: 'bg-blue-100 text-blue-800',
  // 준비
  PREPARING: 'bg-purple-100 text-purple-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  // 배송
  SHIPPING: 'bg-indigo-100 text-indigo-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  IN_DELIVERY: 'bg-indigo-100 text-indigo-800',
  // 완료
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DONE: 'bg-green-100 text-green-800',
  // 취소/실패
  CANCELLED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
  FAILED: 'bg-red-100 text-red-800',
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      if (!currentUser?.id) return;

      setLoading(true);
      const result = await orderApi.getByUserId(currentUser.id);

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.error || '주문 내역을 불러오는데 실패했습니다.');
      }
      setLoading(false);
    };

    fetchOrders();
  }, [isAuthenticated, currentUser, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">주문 내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <p className="text-gray-500 mb-4">주문 내역이 없습니다.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow">
              {/* 주문 헤더 */}
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-500">
                    주문번호: {order.id}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {/* 주문 상품 */}
              <div className="p-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-2">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {item.productImageUrl ? (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">이미지</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {Number(item.price).toLocaleString()}원 x {item.quantity}개
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 주문 요약 */}
              <div className="p-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
                <span className="font-medium">
                  총 {order.items?.reduce((sum, item) => sum + item.quantity, 0)}개 상품
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {(order.totalAmount || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
