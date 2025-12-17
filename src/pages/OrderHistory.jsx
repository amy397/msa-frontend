import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';
import { paymentApi } from '../api/paymentApi';

const STATUS_LABELS = {
  PENDING: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '상품 준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
};

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  SHIPPING: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
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

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const result = await paymentApi.getOrders(currentUser.id);
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.error || '주문 내역을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('주문 내역을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-10">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
          <button onClick={fetchOrders} className="ml-4 underline">
            다시 시도
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">주문 내역이 없습니다.</p>
          <a
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            쇼핑하러 가기
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* 주문 헤더 */}
              <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">주문번호: </span>
                  <span className="font-medium">{order.id}</span>
                  <span className="text-sm text-gray-500 ml-4">
                    {formatDate(order.createdAt || order.orderDate)}
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {/* 주문 상품 목록 */}
              <div className="p-4">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-2 border-b last:border-0"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      이미지
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productName || item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {Number(item.price).toLocaleString()}원 x {item.quantity}개
                      </p>
                    </div>
                    <div className="font-bold">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>

              {/* 주문 총액 */}
              <div className="bg-gray-50 p-4 border-t flex justify-between items-center">
                <span className="font-medium">총 결제금액</span>
                <span className="text-xl font-bold text-blue-600">
                  {Number(order.totalAmount).toLocaleString()}원
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
