import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrder';

function OrderList() {
  const { orders, loading, error, fetchOrders, deleteOrder } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">주문 목록</h1>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">주문번호: {order.id}</p>
              <p className="text-gray-500 text-sm">상태: {order.status}</p>
              <p className="text-gray-500 text-sm">총액: {order.totalAmount?.toLocaleString()}원</p>
            </div>
            <button
              onClick={() => deleteOrder(order.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderList;
