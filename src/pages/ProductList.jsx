import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';

function ProductList() {
  const { products, loading, error, fetchProducts, createProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createProduct({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    });

    if (result.success) {
      setFormData({ name: '', description: '', price: '', stock: '', category: '' });
      setShowForm(false);
    }
  };

  if (loading) return <div className="text-center p-4">로딩중...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">상품 목록</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? '취소' : '상품 등록'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">상품명 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">카테고리</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">가격 *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">재고 *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                min="0"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                rows="2"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            등록하기
          </button>
        </form>
      )}

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
                {product.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                    {product.category}
                  </span>
                )}
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
