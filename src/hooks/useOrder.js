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

  // ¬©Ä ü8 pŒ
  const fetchOrdersByUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    const result = await orderApi.getByUserId(userId);

    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
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

  // 
  const updateOrder = useCallback(async (id, data) => {
    setLoading(true);

    const result = await orderApi.update(id, data);

    if (result.success) {
      await fetchOrders();
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [fetchOrders, setLoading, setError]);

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
    fetchOrdersByUser,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};
