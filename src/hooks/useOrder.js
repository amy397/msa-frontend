import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { ordersState, ordersLoadingState, ordersErrorState } from '../recoil/orderState';
import { orderApi } from '../api/orderApi';

export const useOrders = () => {
  const [orders, setOrders] = useRecoilState(ordersState);
  const [loading, setLoading] = useRecoilState(ordersLoadingState);
  const [error, setError] = useRecoilState(ordersErrorState);

  // ´ pŒ
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await orderApi.getAll();

    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [setOrders, setLoading, setError]);

  // èt pŒ
  const fetchOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    const result = await orderApi.getById(id);

    setLoading(false);
    return result;
  }, [setLoading, setError]);

  // ¬©Ä ü8 pŒ
  const fetchOrdersByUserId = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    const result = await orderApi.getByUserId(userId);

    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [setOrders, setLoading, setError]);

  // Ý1
  const createOrder = useCallback(async (data) => {
    setLoading(true);

    const result = await orderApi.create(data);

    if (result.success) {
      await fetchOrders();
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [fetchOrders, setLoading, setError]);

  // ÁÜ À½
  const updateOrderStatus = useCallback(async (id, status) => {
    setLoading(true);

    const result = await orderApi.updateStatus(id, status);

    if (result.success) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status } : order
        )
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [setOrders, setLoading, setError]);

  // ­
  const deleteOrder = useCallback(async (id) => {
    setLoading(true);

    const result = await orderApi.delete(id);

    if (result.success) {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [setOrders, setLoading, setError]);

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
