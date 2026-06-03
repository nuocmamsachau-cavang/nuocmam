import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, X } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function ProductDetail() {
  const [, params] = useRoute('/product/:id');
  const [, setLocation] = useLocation();
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const { data: product } = trpc.products.getById.useQuery(productId, {
    enabled: productId > 0,
  });

  const { data: productImages = [] } = trpc.productImages.getByProductId.useQuery(productId, {
    enabled: productId > 0,
  });

  const sortedImages = productImages.sort((a, b) => a.displayOrder - b.displayOrder);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Sản phẩm không tìm thấy</p>
      </div>
    );
  }

  const handleClose = () => {
    setIsModalOpen(false);
    setLocation('/');
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <div className="sticky top-0 flex justify-end p-4 border-b bg-white">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images Section */}
              <div className="space-y-4">
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '1/1' }}>
                  {sortedImages.length > 0 ? (
                    <img
                      src={sortedImages[selectedImageIndex].imageUrl}
                      alt={sortedImages[selectedImageIndex].altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🍶</div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {sortedImages.length > 1 && (
                  <div className="flex gap-3">
                    {sortedImages.map((img, idx) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-20 h-20 rounded border-2 overflow-hidden transition ${
                          selectedImageIndex === idx
                            ? 'border-red-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Ảnh ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Image Info */}
                {sortedImages.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded border border-blue-200">
                    <p className="text-sm text-gray-600">
                      <strong>Ảnh:</strong> {selectedImageIndex + 1}/{sortedImages.length}
                    </p>
                    {sortedImages[selectedImageIndex].altText && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Mô tả:</strong> {sortedImages[selectedImageIndex].altText}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="space-y-6">
                <div>
                  <h1 style={{ color: '#C41E3A' }} className="text-3xl font-bold mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div>
                  <div style={{ color: '#C41E3A' }} className="text-4xl font-bold mb-2">
                    {parseFloat(product.price).toLocaleString()}₫
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-bold mb-2">Số lượng</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 p-2 border rounded text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  style={{ backgroundColor: '#C41E3A' }}
                  className="w-full text-white py-6 text-lg font-bold"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Thêm vào giỏ hàng
                </Button>

                {/* Product Details */}
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-bold mb-3">Thông tin sản phẩm</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Tên:</strong> {product.name}</p>
                    <p><strong>Slug:</strong> {product.slug}</p>
                    <p><strong>Giá:</strong> {parseFloat(product.price).toLocaleString()}₫</p>
                    {sortedImages.length > 0 && (
                      <p><strong>Ảnh:</strong> {sortedImages.length} ảnh (tối ưu SEO)</p>
                    )}
                  </div>
                </Card>

                {/* SEO Info */}
                {sortedImages.length > 0 && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <h3 className="font-bold mb-3 text-green-900">✓ Tối ưu SEO</h3>
                    <div className="space-y-2 text-sm text-green-800">
                      <p>✓ Có {sortedImages.length} ảnh chất lượng</p>
                      {sortedImages.every(img => img.altText) && (
                        <p>✓ Tất cả ảnh có mô tả (Alt Text)</p>
                      )}
                      <p>✓ Ảnh được sắp xếp theo thứ tự</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
