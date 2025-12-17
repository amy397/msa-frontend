import { useCartStore } from '../stores/cartStore';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalAmount = useCartStore((state) => state.getTotalAmount);
  const getTotalCount = useCartStore((state) => state.getTotalCount);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount: getTotalAmount(),
    totalCount: getTotalCount(),
  };
}
