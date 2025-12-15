import { useProductStore } from '../stores/productStore';

export const useProducts = () => {
  const products = useProductStore((state) => state.products);
  const loading = useProductStore((state) => state.loading);
  const error = useProductStore((state) => state.error);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const fetchProductById = useProductStore((state) => state.fetchProductById);
  const fetchProductsByCategory = useProductStore((state) => state.fetchProductsByCategory);
  const fetchAvailableProducts = useProductStore((state) => state.fetchAvailableProducts);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const createProduct = useProductStore((state) => state.createProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const decreaseStock = useProductStore((state) => state.decreaseStock);
  const increaseStock = useProductStore((state) => state.increaseStock);
  const setSelectedProduct = useProductStore((state) => state.setSelectedProduct);
  const clearError = useProductStore((state) => state.clearError);

  return {
    products,
    loading,
    error,
    selectedProduct,
    fetchProducts,
    fetchProductById,
    fetchProductsByCategory,
    fetchAvailableProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    decreaseStock,
    increaseStock,
    setSelectedProduct,
    clearError,
  };
};
