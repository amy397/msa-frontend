import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { productApi } from '../api/productApi';

const STATUS_LABELS = {
  AVAILABLE: '판매중',
  OUT_OF_STOCK: '품절',
  DISCONTINUED: '판매중단',
};

const STATUS_COLORS = {
  AVAILABLE: 'bg-green-100 text-green-800',
  OUT_OF_STOCK: 'bg-red-100 text-red-800',
  DISCONTINUED: 'bg-gray-100 text-gray-800',
};

export default function ProductAdmin() {
  const {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductsByCategory,
    fetchAvailableProducts,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    decreaseStock,
    increaseStock,
    clearError,
  } = useProducts();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    imageUrl: '',
  });
<<<<<<< HEAD
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
=======
  const [imagePreview, setImagePreview] = useState('');

  // 이미지 파일을 Base64로 변환
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, imageUrl: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제
  const handleImageRemove = () => {
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview('');
  };
>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    if (searchKeyword.trim()) {
      await searchProducts(searchKeyword);
    } else {
      await fetchProducts();
    }
  };

  const handleCategoryFilter = async (category) => {
    setCategoryFilter(category);
    setShowOnlyAvailable(false);
    if (category) {
      await fetchProductsByCategory(category);
    } else {
      await fetchProducts();
    }
  };

  const handleAvailableFilter = async () => {
    setShowOnlyAvailable(!showOnlyAvailable);
    setCategoryFilter('');
    if (!showOnlyAvailable) {
      await fetchAvailableProducts();
    } else {
      await fetchProducts();
    }
  };

  const handleReset = async () => {
    setSearchKeyword('');
    setCategoryFilter('');
    setShowOnlyAvailable(false);
    await fetchProducts();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' });
<<<<<<< HEAD
    setImageFile(null);
    setImagePreview(null);
=======
    setImagePreview('');
>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
    });
<<<<<<< HEAD
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
=======
    setImagePreview(product.imageUrl || '');
>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = formData.imageUrl;

    // 새 이미지가 있으면 먼저 업로드
    if (imageFile) {
      setUploadingImage(true);
      const uploadResult = await productApi.uploadImage(imageFile);
      setUploadingImage(false);

      if (uploadResult.success && uploadResult.data.imageUrl) {
        imageUrl = uploadResult.data.imageUrl;
      } else {
        alert('이미지 업로드에 실패했습니다: ' + (uploadResult.error || ''));
        return;
      }
    }

    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      imageUrl,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setShowModal(false);
    setImageFile(null);
    setImagePreview(null);
    await fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await deleteProduct(id);
    }
  };

  const handleStockChange = async (id, type) => {
    const quantity = prompt('변경할 수량을 입력하세요:', '1');
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
      if (type === 'increase') {
        await increaseStock(id, parseInt(quantity));
      } else {
        await decreaseStock(id, parseInt(quantity));
      }
      await fetchProducts();
    }
  };

  // 카테고리 목록 추출
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + 상품 등록
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:underline">
            닫기
          </button>
        </div>
      )}

      {/* 검색 및 필터 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="상품명 검색..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            검색
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            초기화
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleAvailableFilter}
            className={`px-3 py-1 rounded ${
              showOnlyAvailable
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            판매중만 보기
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-3 py-1 rounded ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 상품 목록 */}
      {loading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow">
              {/* 상품 이미지 */}
<<<<<<< HEAD
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
=======
              <div className="h-32 bg-gray-200 rounded mb-3 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span
                  className={`text-gray-400 ${product.imageUrl ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                >
                  이미지 없음
                </span>
              </div>

>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    STATUS_COLORS[product.status] || 'bg-gray-100'
                  }`}
                >
                  {STATUS_LABELS[product.status] || product.status}
                </span>
              </div>

              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                  {product.category}
                </span>
              )}

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description || '설명 없음'}
              </p>

              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-blue-600">
                  {Number(product.price).toLocaleString()}원
                </span>
                <span className="text-sm text-gray-500">재고: {product.stock}</span>
              </div>

              {/* 재고 조정 버튼 */}
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => handleStockChange(product.id, 'decrease')}
                  className="flex-1 bg-orange-100 text-orange-700 py-1 rounded text-sm hover:bg-orange-200"
                >
                  재고 감소
                </button>
                <button
                  onClick={() => handleStockChange(product.id, 'increase')}
                  className="flex-1 bg-green-100 text-green-700 py-1 rounded text-sm hover:bg-green-200"
                >
                  재고 증가
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(product)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-100 text-red-700 py-2 rounded hover:bg-red-200"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 상품 등록/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? '상품 수정' : '상품 등록'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">상품명 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">가격 *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">재고 *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    min="0"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="예: 전자제품, 의류, 식품"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">상품 이미지</label>
<<<<<<< HEAD
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border rounded"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
=======
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border rounded text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500">JPG, PNG, GIF 형식 (최대 5MB)</p>
                  {imagePreview && (
                    <div className="relative">
                      <div className="h-32 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="미리보기"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        X
                      </button>
                    </div>
                  )}
                </div>
>>>>>>> 7e734a2760bf1df37ebd0d34d72e556aec38c995
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {uploadingImage ? '이미지 업로드 중...' : loading ? '처리 중...' : editingProduct ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
