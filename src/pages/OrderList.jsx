import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrder';

function OrderList() {
  const { orders, loading, error, fetchOrders, updateOrderStatus, deleteOrder } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">주문 목록</h1>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="text-gray-500 text-center p-4">주문이 없습니다.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">주문번호: {order.id}</p>
                  <p className="text-gray-500 text-sm">주문자: {order.userId}</p>
                  <p className="text-gray-500 text-sm">
                    총액: {order.totalAmount?.toLocaleString()}원
                  </p>
                  <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="PENDING">대기중</option>
                    <option value="CONFIRMED">확인됨</option>
                    <option value="SHIPPED">배송중</option>
                    <option value="DELIVERED">배송완료</option>
                    <option value="CANCELLED">취소됨</option>
                  </select>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderList;
