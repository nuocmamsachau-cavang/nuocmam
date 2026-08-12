import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { filterApprovedReviews } from '@/lib/publicContent';
import { ShoppingCart, X, CheckCircle, ShieldCheck, Truck, Award, Star, MessageSquare, Send } from 'lucide-react';

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
  const [reviewForm, setReviewForm] = useState({ customerName: '', customerEmail: '', rating: 5, title: '', content: '' });
  const [reviewNotice, setReviewNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data: product, isLoading: productLoading } = trpc.products.getById.useQuery(productId, {
    enabled: productId > 0,
  });

  const { data: productImages = [] } = trpc.productImages.getByProductId.useQuery(productId, {
    enabled: productId > 0,
  });
  const { data: approvedReviewsData = [] } = trpc.reviews.getApproved.useQuery(productId, {
    enabled: productId > 0,
  });
  const { data: ratingSummary = { averageRating: 0, reviewCount: 0 } } = trpc.reviews.getSummary.useQuery(productId, {
    enabled: productId > 0,
  });
  const approvedReviews = filterApprovedReviews(approvedReviewsData);
  const reviewUtils = trpc.useUtils();
  const createReviewMutation = trpc.reviews.create.useMutation();

  const sortedImages = productImages.sort((a, b) => a.displayOrder - b.displayOrder);

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setReviewNotice(null);
    if (!reviewForm.customerName.trim() || !reviewForm.title.trim() || !reviewForm.content.trim()) {
      setReviewNotice({ type: 'error', text: 'Vui lòng nhập tên, tiêu đề và nội dung đánh giá.' });
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        customerName: reviewForm.customerName.trim(),
        customerEmail: reviewForm.customerEmail.trim() || undefined,
        rating: reviewForm.rating,
        title: reviewForm.title.trim(),
        content: reviewForm.content.trim(),
      });
      await Promise.all([
        reviewUtils.reviews.getApproved.invalidate(productId),
        reviewUtils.reviews.getSummary.invalidate(productId),
      ]);
      setReviewForm({ customerName: '', customerEmail: '', rating: 5, title: '', content: '' });
      setReviewNotice({ type: 'success', text: 'Đã gửi đánh giá. Nội dung sẽ hiển thị sau khi được duyệt.' });
    } catch (error) {
      console.error('Review submission failed:', error);
      setReviewNotice({ type: 'error', text: 'Không thể gửi đánh giá lúc này. Vui lòng thử lại.' });
    }
  };

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

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
                  <div className="mt-4 flex flex-wrap items-center gap-3" aria-label={ratingSummary.reviewCount > 0 ? `${ratingSummary.averageRating} trên 5 sao từ ${ratingSummary.reviewCount} đánh giá đã duyệt` : 'Chưa có đánh giá đã duyệt'}>
                    <span className="flex items-center gap-0.5 text-[#D4AF37]" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} className={star <= Math.round(ratingSummary.averageRating) ? 'fill-current' : ''} />)}
                    </span>
                    {ratingSummary.reviewCount > 0 ? (
                      <span className="text-sm font-semibold text-[#8B1428]">{ratingSummary.averageRating.toFixed(1)}/5 · {ratingSummary.reviewCount} đánh giá đã duyệt</span>
                    ) : (
                      <span className="text-sm text-gray-500">Chưa có đánh giá đã duyệt</span>
                    )}
                  </div>
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

                {/* Product Details - Authentic Sa Châu, Giao Thủy, Nam Định Specifications */}
                <Card className="p-5 bg-amber-50/50 border-amber-200">
                  <h3 className="font-bold mb-3 text-amber-900 flex items-center gap-2">
                    <Award size={18} className="text-amber-700" /> Đặc điểm & Tiêu chuẩn chất lượng Sa Châu
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Xuất xứ:</strong> Làng nghề nước mắm truyền thống Sa Châu, xã Giao Châu, huyện Giao Thủy, tỉnh Nam Định (hơn 200 năm lịch sử).</p>
                    <p><strong>Thành phần:</strong> {
                      product.name.toLowerCase().includes('nục') ? 'Cá nục tươi tuyển chọn và muối biển sạch theo tỷ lệ vàng truyền thống.' :
                      product.name.toLowerCase().includes('mực') ? 'Cá mực tươi nguyên chất và muối biển sạch.' :
                      product.name.toLowerCase().includes('cơm') ? 'Cá cơm than tươi nguyên chất và muối biển sạch.' :
                      product.name.toLowerCase().includes('tôm') ? 'Tép biển tươi nguyên chất và muối biển sạch.' :
                      'Cá biển tươi nguyên chất và muối biển sạch.'
                    }</p>
                    <p><strong>Phương pháp ủ chượp:</strong> Phương pháp "ăn sương nằm nắng" độc đáo trong các ang/chum sành phơi ngoài trời dưới ánh nắng và sương gió vùng biển Giao Thủy, Nam Định.</p>
                    <p><strong>Đặc trưng:</strong> {
                      product.name.toLowerCase().includes('nục') ? 'Nước mắm cá nục đậm đà, màu cánh gián đặc trưng, giàu đạm tự nhiên và hậu vị sâu.' :
                      product.name.toLowerCase().includes('mực') ? 'Nước mắm cá mực sánh đặc, hương vị đậm đà độc đáo của vùng biển Giao Thủy.' :
                      product.name.toLowerCase().includes('cơm') ? 'Nước mắm cá cơm vị ngọt thanh, hương thơm dịu nhẹ, chuẩn cốt nhĩ truyền thống.' :
                      product.name.toLowerCase().includes('tôm') ? 'Mắm tôm nhuyễn mịn, thơm lừng đặc trưng, chuẩn vị gia truyền đất Nam Định.' :
                      'Nước mắm cốt nhĩ đậm đặc, tinh túy từ làng nghề 200 năm.'
                    }</p>
                    <p><strong>Cam kết:</strong> 100% nguyên chất, không chất bảo quản, không đạm nhân tạo, không hóa chất.</p>
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

                {/* Approved Reviews and Public Submission */}
                <Card className="p-5 border-amber-200 bg-white">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 font-bold text-amber-900"><MessageSquare size={18} /> Đánh Giá Sản Phẩm</h3>
                    <span className="text-sm font-semibold text-[#8B1428]">{ratingSummary.reviewCount} đánh giá đã duyệt</span>
                  </div>
                  <div className="space-y-3">
                    {approvedReviews.length === 0 ? (
                      <p className="rounded bg-gray-50 p-4 text-sm text-gray-600">Chưa có đánh giá được duyệt cho sản phẩm này.</p>
                    ) : (
                      approvedReviews.map((review) => (
                        <div key={review.id} className="rounded border border-gray-200 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-gray-900">{review.title}</p>
                              <p className="text-sm text-gray-500">{review.customerName}</p>
                            </div>
                            <div className="flex text-[#D4AF37]" aria-label={`${review.rating} trên 5 sao`}>
                              {Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill={index < review.rating ? 'currentColor' : 'none'} />)}
                            </div>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-700">{review.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3 border-t pt-5">
                    <h4 className="font-semibold text-[#8B1428]">Chia sẻ trải nghiệm của bạn</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className="rounded border p-2 text-sm" placeholder="Tên của bạn *" value={reviewForm.customerName} onChange={(event) => setReviewForm({ ...reviewForm, customerName: event.target.value })} />
                      <input className="rounded border p-2 text-sm" type="email" placeholder="Email (không bắt buộc)" value={reviewForm.customerEmail} onChange={(event) => setReviewForm({ ...reviewForm, customerEmail: event.target.value })} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Số sao</label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, index) => {
                          const rating = index + 1;
                          return <button key={rating} type="button" aria-label={`${rating} sao`} onClick={() => setReviewForm({ ...reviewForm, rating })} className="text-[#D4AF37]"><Star size={20} fill={rating <= reviewForm.rating ? 'currentColor' : 'none'} /></button>;
                        })}
                      </div>
                    </div>
                    <input className="w-full rounded border p-2 text-sm" placeholder="Tiêu đề đánh giá *" value={reviewForm.title} onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })} />
                    <textarea className="w-full rounded border p-2 text-sm" rows={4} placeholder="Nội dung đánh giá *" value={reviewForm.content} onChange={(event) => setReviewForm({ ...reviewForm, content: event.target.value })} />
                    {reviewNotice && <p className={`rounded p-3 text-sm ${reviewNotice.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{reviewNotice.text}</p>}
                    <Button type="submit" disabled={createReviewMutation.isPending} style={{ backgroundColor: '#C41E3A' }} className="text-white"><Send size={16} className="mr-2" />{createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}</Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
