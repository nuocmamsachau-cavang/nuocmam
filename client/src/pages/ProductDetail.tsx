import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, X, CheckCircle, ShieldCheck, Truck, Award } from 'lucide-react';

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
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-md" style={{ aspectRatio: '1/1' }}>
                  {sortedImages.length > 0 ? (
                    <img
                      src={sortedImages[selectedImageIndex].imageUrl}
                      alt={sortedImages[selectedImageIndex].altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1598514982205-f36804f32e98?w=800&q=80"
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
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
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem('nuocmam_cart');
                      const cart = saved ? JSON.parse(saved) : [];
                      const existing = cart.find((item: any) => item.id === product.id);
                      if (existing) {
                        existing.quantity += quantity;
                      } else {
                        cart.push({
                          id: product.id,
                          name: product.name,
                          price: parseFloat(product.price),
                          quantity: quantity,
                        });
                      }
                      localStorage.setItem('nuocmam_cart', JSON.stringify(cart));
                      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
                      handleClose();
                    } catch (error) {
                      console.error('Error adding to cart:', error);
                    }
                  }}
                  style={{ backgroundColor: '#C41E3A' }}
                  className="w-full text-white py-6 text-lg font-bold hover:opacity-90 transition"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Thêm vào giỏ hàng
                </Button>

                {/* Product Details - Lê Gia Style Specifications with Dynamic Material Mapping */}
                <Card className="p-5 bg-amber-50/50 border-amber-200">
                  <h3 className="font-bold mb-3 text-amber-900 flex items-center gap-2">
                    <Award size={18} className="text-amber-700" /> Đặc điểm & Tiêu chuẩn chất lượng
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Thành phần:</strong> {
                      product.name.toLowerCase().includes('nục') ? 'Cá nục tươi tuyển chọn (95%), muối biển tinh khiết Sa Châu (5%).' :
                      product.name.toLowerCase().includes('mực') ? 'Cá mực tươi nguyên chất (95%), muối biển tinh khiết (5%).' :
                      product.name.toLowerCase().includes('cơm') ? 'Cá cơm than tươi nguyên chất (75%), muối biển tinh khiết (25%).' :
                      product.name.toLowerCase().includes('tôm') ? 'Tép biển tươi / tôm sú nguyên chất, muối biển tinh khiết.' :
                      'Cá biển tươi nguyên chất, muối biển tinh khiết Sa Châu.'
                    }</p>
                    <p><strong>Phương pháp:</strong> Ủ chượp tự nhiên trong lu sành phơi nắng theo phương pháp gài nén truyền thống làng nghề Sa Châu 200 năm.</p>
                    <p><strong>Đặc trưng:</strong> {
                      product.name.toLowerCase().includes('nục') ? 'Nước mắm cá nục đậm đà, béo ngậy, giàu đạm tự nhiên, màu cánh gián sáng.' :
                      product.name.toLowerCase().includes('mực') ? 'Nước mắm cá mực sánh đặc như mật ong, vị ngọt đậm đà đặc trưng.' :
                      product.name.toLowerCase().includes('cơm') ? 'Nước mắm cá cơm vị ngọt thanh, hương thơm dịu nhẹ, hậu vị sâu.' :
                      product.name.toLowerCase().includes('tôm') ? 'Mắm tôm nhuyễn mịn, thơm lừng đặc trưng, chuẩn vị gia truyền.' :
                      'Nước mắm cốt nhĩ đậm đặc, tinh túy từ biển mẹ.'
                    }</p>
                    <p><strong>Cam kết:</strong> 100% nguyên chất, không chất bảo quản, không đạm nhân tạo, không hương liệu.</p>
                    <p><strong>Bảo quản:</strong> Nơi khô ráo, thoáng mát, đậy kín nắp sau khi sử dụng.</p>
                  </div>
                </Card>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                    <ShieldCheck size={20} className="text-green-600 shrink-0" />
                    <span>Chứng nhận VSATTP & OCOP 4 Sao</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded border">
                    <Truck size={20} className="text-blue-600 shrink-0" />
                    <span>Giao hàng toàn quốc nhanh chóng</span>
                  </div>
                </div>

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
