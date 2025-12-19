import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';
import { orderApi } from '../api/orderApi';

const STATUS_LABELS = {
  PENDING: '주문 대기',
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
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      이미지
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
