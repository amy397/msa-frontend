import { usePaymentStore } from '../stores/paymentStore';

export const usePayment = () => {
  const payments = usePaymentStore((state) => state.payments);
  const loading = usePaymentStore((state) => state.loading);
  const error = usePaymentStore((state) => state.error);
  const selectedPayment = usePaymentStore((state) => state.selectedPayment);

  const fetchPayments = usePaymentStore((state) => state.fetchPayments);
  const fetchPaymentById = usePaymentStore((state) => state.fetchPaymentById);
  const fetchPaymentsByUserId = usePaymentStore((state) => state.fetchPaymentsByUserId);
  const fetchPaymentByOrderId = usePaymentStore((state) => state.fetchPaymentByOrderId);
  const createPayment = usePaymentStore((state) => state.createPayment);
  const confirmPayment = usePaymentStore((state) => state.confirmPayment);
  const cancelPayment = usePaymentStore((state) => state.cancelPayment);
  const refundPayment = usePaymentStore((state) => state.refundPayment);
  const setSelectedPayment = usePaymentStore((state) => state.setSelectedPayment);
  const clearError = usePaymentStore((state) => state.clearError);

  return {
    payments,
    loading,
    error,
    selectedPayment,
    fetchPayments,
    fetchPaymentById,
    fetchPaymentsByUserId,
    fetchPaymentByOrderId,
    createPayment,
    confirmPayment,
    cancelPayment,
    refundPayment,
    setSelectedPayment,
    clearError,
  };
};
