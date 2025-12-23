import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useUser';
import { orderApi } from '../api/orderApi';

// 백엔드 OrderStatus enum과 일치
const STATUS_OPTIONS = [
  { value: 'PENDING', label: '주문 대기', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMED', label: '주문 확정', color: 'bg-blue-100 text-blue-800' },
  { value: 'SHIPPING', label: '배송중', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'DELIVERED', label: '배송 완료', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: '주문 취소', color: 'bg-red-100 text-red-800' },
];

export default function AdminOrders() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 관리자 권한 체크
    if (currentUser?.role !== 'ADMIN') {
      alert('관리자 권한이 필요합니다.');
      navigate('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, currentUser, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await orderApi.getAll();

    if (result.success) {
      // 최신 주문이 위로 오도록 정렬
      const sortedOrders = (result.data || []).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } else {
      setError(result.error || '주문 목록을 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);

    const result = await orderApi.updateStatus(orderId, newStatus);

    if (result.success) {
      // 로컬 상태 업데이트
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }

    setUpdating(null);
  };

  const getStatusColor = (status) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === status);
    return option?.label || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">주문 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <button
          onClick={fetchOrders}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          새로고침
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <p className="text-gray-500">주문이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">주문번호</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">주문일시</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">고객이메일</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상품</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">배송지</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">금액</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">현재상태</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태변경</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.userEmail || order.email || `ID: ${order.userId}`}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.items?.length > 0 ? (
                      <span>
                        {order.items[0].productName}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.shippingAddress ? (
                      <div className="max-w-xs">
                        <p className="font-medium">{order.shippingAddress.recipientName}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress.phone}</p>
                        <p className="text-xs text-gray-500 truncate" title={`${order.shippingAddress.address} ${order.shippingAddress.addressDetail || ''}`}>
                          [{order.shippingAddress.zipCode}] {order.shippingAddress.address}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">
                    {(order.totalAmount || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0).toLocaleString()}원
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="border rounded px-2 py-1 text-sm disabled:bg-gray-100"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {updating === order.id && (
                      <span className="ml-2 text-xs text-gray-500">저장중...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
