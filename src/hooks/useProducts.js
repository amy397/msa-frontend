import { useRecoilState } from 'recoil';
import { useCallback } from 'react';
import { productsState, productsLoadingState, productsErrorState } from '../recoil/productState';
import { productApi } from '../api/productApi';

export const useProducts = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [loading, setLoading] = useRecoilState(productsLoadingState);
  const [error, setError] = useRecoilState(productsErrorState);

  // ´ pŒ
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await productApi.getAll();

    if (result.success) {
      setProducts(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [setProducts, setLoading, setError]);

  // èt pŒ
  const fetchProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    const result = await productApi.getById(id);

    setLoading(false);
    return result;
  }, [setLoading, setError]);

  // Ý1
  const createProduct = useCallback(async (data) => {
    setLoading(true);

    const result = await productApi.create(data);

    if (result.success) {
      await fetchProducts();
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [fetchProducts, setLoading, setError]);

  // 
  const updateProduct = useCallback(async (id, data) => {
    setLoading(true);

    const result = await productApi.update(id, data);

    if (result.success) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...data } : product
        )
      );
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [setProducts, setLoading, setError]);

  // ­
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);

    const result = await productApi.delete(id);

    if (result.success) {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } else {
      setError(result.error);
    }

    setLoading(false);
    return result;
  }, [setProducts, setLoading, setError]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
