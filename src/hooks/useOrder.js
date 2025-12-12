import { useOrderStore } from '../stores/orderStore';

export const useOrders = () => {
  const orders = useOrderStore((state) => state.orders);
  const loading = useOrderStore((state) => state.loading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchOrderById = useOrderStore((state) => state.fetchOrderById);
  const fetchOrdersByUserId = useOrderStore((state) => state.fetchOrdersByUserId);
  const createOrder = useOrderStore((state) => state.createOrder);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    fetchOrdersByUserId,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  };
};
