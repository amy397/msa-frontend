import { useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error, fetchProducts, deleteProduct } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">상품 목록</h1>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-gray-500 text-center p-4">상품이 없습니다.</div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.price?.toLocaleString()}원</p>
                <p className="text-gray-400 text-xs">재고: {product.stock}개</p>
              </div>
              <button
                onClick={() => deleteProduct(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
