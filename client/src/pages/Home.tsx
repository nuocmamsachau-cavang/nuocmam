import { useMemo, useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, MapPin, Phone, RotateCcw, Search, ShoppingCart, SlidersHorizontal, Star } from 'lucide-react';
import { useLocation } from 'wouter';
import { getPublicBrandConfig, getHeroStyle } from '@/lib/brandAssets';
import { getPromotionCards } from '@/lib/promotions';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Home() {
  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nuocmam_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nuocmam_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cart]);
  const [showCart, setShowCart] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const { data: promotionsData } = trpc.promotions.list.useQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'priceAsc' | 'priceDesc' | 'ratingDesc' | 'salesDesc'>('default');
  const parsedMinPrice = minPrice.trim() ? Number(minPrice) : undefined;
  const parsedMaxPrice = maxPrice.trim() ? Number(maxPrice) : undefined;
  const hasInvalidPriceRange = (parsedMinPrice !== undefined && Number.isNaN(parsedMinPrice))
    || (parsedMaxPrice !== undefined && Number.isNaN(parsedMaxPrice))
    || (parsedMinPrice !== undefined && parsedMaxPrice !== undefined && parsedMinPrice > parsedMaxPrice);
  const productQuery = useMemo(() => ({
    search: searchTerm.trim() || undefined,
    minPrice: parsedMinPrice,
    maxPrice: parsedMaxPrice,
    sort: sortOption,
  }), [searchTerm, parsedMinPrice, parsedMaxPrice, sortOption]);
  const { data: products = [], isLoading: productsLoading } = trpc.products.list.useQuery(productQuery, {
    enabled: !hasInvalidPriceRange,
  });
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const promotionCards = getPromotionCards(promotionsData as any[] | undefined);
  const { data: brandAssets } = trpc.brand.get.useQuery();
  const publicBrand = getPublicBrandConfig(brandAssets);
  const mascotLogo = publicBrand.mascotLogo;
  const horizontalLogo = publicBrand.horizontalLogo;
  const heroBanner = publicBrand.heroBanner;
  const [productImagesMap, setProductImagesMap] = useState<Record<number, any>>({});
  const [, setLocation] = useLocation();

  const utils = trpc.useUtils();
  
  // Load images for all products using tRPC client utils
  useEffect(() => {
    const loadImages = async () => {
      const newImagesMap: Record<number, any> = {};
      
      for (const product of products) {
        try {
          const data = await utils.productImages.getByProductId.fetch(product.id);
          if (data && Array.isArray(data) && data.length > 0) {
            newImagesMap[product.id] = data;
          }
        } catch (error) {
          console.error(`Failed to load images for product ${product.id}:`, error);
        }
      }
      
      setProductImagesMap(newImagesMap);
    };
    
    if (products.length > 0) {
      loadImages();
    }
  }, [products]);

  const createOrderMutation = trpc.orders.create.useMutation();

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { id: product.id, name: product.name, price: parseFloat(product.price), quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
  };

  const clearCart = () => {
    if (confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      setCart([]);
      localStorage.removeItem('nuocmam_cart');
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (cart.length === 0) {
      alert('Giỏ hàng trống');
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        customerAddress: customerInfo.address,
        items: JSON.stringify(cart),
        totalAmount: getTotalPrice().toString(),
      });

      alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      setCart([]);
      setCustomerInfo({ name: '', phone: '', email: '', address: '' });
      setShowCart(false);
    } catch (error) {
      alert('Lỗi khi đặt hàng. Vui lòng thử lại.');
    }
  };

  const groupedProducts = products.reduce((acc: any, product: any) => {
    const categoryId = product.categoryId;
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(product);
    return acc;
  }, {});

  const resetProductFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('default');
  };

  const renderRating = (product: any) => {
    const averageRating = Number(product.averageRating ?? 0);
    const reviewCount = Number(product.reviewCount ?? 0);
    return (
      <div className="mb-3 flex min-h-5 items-center gap-2 text-sm" aria-label={reviewCount > 0 ? `${averageRating} trên 5 sao từ ${reviewCount} đánh giá` : 'Chưa có đánh giá'}>
        <span className="flex items-center gap-0.5 text-[#D4AF37]" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} className={star <= Math.round(averageRating) ? 'fill-current' : ''} />)}
        </span>
        {reviewCount > 0 ? (
          <span className="text-xs text-gray-600">{averageRating.toFixed(1)} ({reviewCount} đánh giá)</span>
        ) : (
          <span className="text-xs text-gray-500">Chưa có đánh giá</span>
        )}
      </div>
    );
  };

  const renderProductCard = (product: any) => (
    <Card key={product.id} className="p-4 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative mb-3 flex h-40 w-full items-center justify-center overflow-hidden rounded bg-amber-100">
        <img
          src={(productImagesMap[product.id] && productImagesMap[product.id].length > 0)
            ? productImagesMap[product.id][0].imageUrl
            : (product.imageUrl || `https://picsum.photos/seed/nuocmam${product.id}/800/800`)}
          alt={(productImagesMap[product.id] && productImagesMap[product.id].length > 0)
            ? (productImagesMap[product.id][0].altText || product.name)
            : product.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={(event) => {
            const target = event.target as HTMLImageElement;
            if (!target.src.includes('picsum.photos')) target.src = `https://picsum.photos/seed/nuocmam${product.id}/800/800`;
          }}
        />
      </div>
      <h4 style={{ color: '#C41E3A' }} className="mb-2 font-bold">{product.name}</h4>
      <p className="mb-3 line-clamp-3 text-sm text-gray-600">{product.description}</p>
      {renderRating(product)}
      <div className="mb-2 flex items-end justify-between gap-2">
        <div style={{ color: '#C41E3A' }} className="text-xl font-bold">
          {parseFloat(product.price).toLocaleString()}₫
        </div>
        {Number(product.salesCount ?? 0) > 0 && <span className="text-xs text-gray-500">Đã bán {product.salesCount}</span>}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => addToCart(product)} style={{ backgroundColor: '#D4AF37', color: '#C41E3A' }} className="flex-1 text-sm">
          + Thêm
        </Button>
        <Button variant="outline" className="flex-1 text-sm" onClick={() => setLocation(`/product/${product.id}`)}>
          Chi Tiết
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFDFB' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)' }} className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <img
              src={mascotLogo}
              alt="Logo Nước Mắm Cá Vàng Sa Châu"
              className="h-11 w-11 rounded-full object-cover object-center ring-2 ring-[#D4AF37] shadow-md"
              loading="eager"
            />
            <span>Nước Mắm Cá Vàng</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#home" className="hover:opacity-80">Trang Chủ</a>
            <a href="#products" className="hover:opacity-80">Sản Phẩm</a>
            <a href="/about" className="hover:opacity-80">Về Chúng Tôi</a>
            <a href="/blog" className="hover:opacity-80">Bài Viết</a>
            <a href="#contact" className="hover:opacity-80">Liên Hệ</a>
          </nav>
          <div className="flex gap-3 items-center">
            <a href="https://www.facebook.com/nuocmamcavanglangsachau/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">f</a>
            <a href="https://www.instagram.com/nuocmamcavang?igsh=MXd2cXE3ZTRjNWo2dQ==" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">📷</a>
            <a href="https://www.tiktok.com/@nuocmamcavang?_r=1&_t=ZS-95iUYcGkLYX" target="_blank" rel="noopener noreferrer" className="hover:opacity-80">♪</a>
            <Button
              onClick={() => setShowCart(!showCart)}
              style={{ backgroundColor: '#D4AF37', color: '#C41E3A' }}
              className="relative"
            >
              <ShoppingCart size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        style={getHeroStyle(heroBanner)}
        className="text-white py-20 text-center min-h-[360px] flex flex-col items-center justify-center"
      >
        <h1 className="text-5xl font-bold mb-4">Nước Mắm Cá Vàng</h1>
        <p className="text-2xl mb-4" style={{ color: '#D4AF37' }}>Tinh Túy Làng Nghề Sa Châu 200 Năm</p>
        <p className="text-lg mb-8 max-w-2xl mx-auto">Nước mắm truyền thống nguyên chất, kết tinh từ nắng gió biển cả và tâm huyết của những nghệ nhân giữ lửa làng nghề hơn 2 thế kỷ.</p>
        <Button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ backgroundColor: '#D4AF37', color: '#C41E3A' }}
          className="font-bold"
        >
          🛍️ Khám Phá Sản Phẩm
        </Button>
      </section>

      {/* Promotion Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotionCards.map((promo) => (
              <div
                key={promo.id}
                style={{ backgroundColor: promo.backgroundColor }}
                className="rounded-lg p-8 text-white shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 style={{ color: promo.textColor }} className="text-2xl font-bold mb-2">
                      {promo.title}
                    </h3>
                    <p className="text-white mb-4">{promo.description}</p>
                    <Button
                      onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                      style={{ backgroundColor: promo.textColor, color: promo.backgroundColor }}
                      className="font-bold"
                    >
                      Mua Ngay
                    </Button>
                  </div>
                  <div
                    style={{ color: promo.textColor }}
                    className="text-5xl font-bold"
                  >
                    {promo.discount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ color: '#C41E3A' }} className="text-3xl font-bold mb-6 border-b-4 border-yellow-600 pb-3 inline-block">
            Hơn 200 Năm Gìn Giữ Hương Vị Việt
          </h2>
          <p className="text-lg mb-4">
            Nước Mắm Cá Vàng được sản xuất tại <strong>Làng Sa Châu, Giao Hưng, Nam Định</strong> - nơi có truyền thống làm mắm lâu đời từ thời cha ông. Chúng tôi tự hào mang đến dòng nước mắm chắt nguyên chất, được ủ chượp tự nhiên từ 12-24 tháng, không hóa chất, không chất bảo quản.
          </p>
          <p className="text-lg">
            Mỗi giọt nước mắm là sự kết hợp hoàn hảo giữa cá tươi và muối biển tinh khiết, được phơi nắng, đánh đảo kỹ lưỡng để tạo nên màu cánh gián đặc trưng và vị ngọt hậu sâu sắc.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 style={{ color: '#C41E3A' }} className="mb-8 inline-block w-full border-b-4 border-yellow-600 pb-3 text-center text-3xl font-bold">
            Danh Mục Sản Phẩm Truyền Thống
          </h2>

          <div className="mb-10 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 font-bold text-[#8B1428]">
              <SlidersHorizontal size={20} /> Tìm sản phẩm phù hợp
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)_auto] md:items-end">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Từ khóa</span>
                <div className="relative">
                  <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8B1428]" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Ví dụ: cá nục, cốt đặc biệt..."
                    className="w-full rounded-lg border border-amber-200 bg-[#fffaf2] py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Giá từ (₫)</span>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-amber-200 bg-[#fffaf2] px-3 py-2.5 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Giá đến (₫)</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Không giới hạn"
                  className="w-full rounded-lg border border-amber-200 bg-[#fffaf2] px-3 py-2.5 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-gray-700">Sắp xếp</span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as typeof sortOption)}
                  className="w-full rounded-lg border border-amber-200 bg-[#fffaf2] px-3 py-2.5 text-sm outline-none transition focus:border-[#C41E3A] focus:ring-2 focus:ring-[#D4AF37]/40"
                >
                  <option value="default">Mặc định</option>
                  <option value="priceAsc">Giá thấp đến cao</option>
                  <option value="priceDesc">Giá cao đến thấp</option>
                  <option value="ratingDesc">Đánh giá cao nhất</option>
                  <option value="salesDesc">Bán chạy nhất</option>
                </select>
              </label>
              <Button variant="outline" onClick={resetProductFilters} className="border-amber-300 text-[#8B1428] hover:bg-amber-50">
                <RotateCcw size={16} className="mr-2" /> Xóa lọc
              </Button>
            </div>
            {hasInvalidPriceRange && (
              <p className="mt-3 text-sm font-semibold text-red-700">Vui lòng nhập khoảng giá hợp lệ; giá tối thiểu không được lớn hơn giá tối đa.</p>
            )}
          </div>

          {productsLoading ? (
            <p className="rounded-xl border border-amber-200 bg-white p-8 text-center text-gray-500">Đang tìm sản phẩm...</p>
          ) : products.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-white p-10 text-center shadow-sm">
              <Search className="mx-auto mb-4 text-[#D4AF37]" size={40} />
              <h3 className="text-xl font-bold text-[#8B1428]">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="mt-2 text-gray-600">Hãy thử từ khóa khác hoặc mở rộng khoảng giá để xem thêm sản phẩm.</p>
              <Button onClick={resetProductFilters} className="mt-5 bg-[#D4AF37] font-bold text-[#8B1428] hover:bg-[#c49f2f]">Xem toàn bộ sản phẩm</Button>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-gray-600">Đang hiển thị <strong className="text-[#8B1428]">{products.length}</strong> sản phẩm phù hợp.</p>
              {categories.map((category) => {
                const categoryProducts = groupedProducts[category.id] ?? [];
                if (categoryProducts.length === 0) return null;
                return (
                  <div key={category.id} className="mb-12">
                    <h3 style={{ color: '#8B1428' }} className="mb-6 border-l-4 border-yellow-600 pl-4 text-2xl font-bold">
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {categoryProducts.map((product: any) => renderProductCard(product))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ color: '#C41E3A' }} className="text-3xl font-bold mb-8 text-center border-b-4 border-yellow-600 pb-3 inline-block w-full">
            Hành Trình Giọt Nước Mắm Chắt
          </h2>
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/nB7cGQPGRD4"
              title="Nước Mắm Cá Vàng"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ color: '#C41E3A' }} className="text-3xl font-bold mb-12 text-center border-b-4 border-yellow-600 pb-3 inline-block w-full">
            Liên Hệ Với Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
              <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2">Điện Thoại</h3>
              <a href="tel:0867678527" className="text-blue-600 hover:underline">0867 678 527</a>
            </div>
            <div className="text-center">
              <Mail size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
              <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2">Email</h3>
              <a href="mailto:nuocmamcavangsachau@gmail.com" className="text-blue-600 hover:underline">nuocmamcavangsachau@gmail.com</a>
            </div>
            <div className="text-center">
              <MapPin size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
              <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2">Địa Chỉ</h3>
              <a href="https://share.google/E2MS6ylUWEiN940B4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Làng Sa Châu, Giao Hưng, Ninh Bình
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2C2C2C' }} className="text-white py-8 text-center">
        {horizontalLogo && (
          <img
            src={horizontalLogo}
            alt="Nước Mắm Cá Vàng - Sa Châu"
            className="mx-auto mb-5 max-h-20 max-w-[280px] object-contain"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <p>&copy; 2026 Nước Mắm Cá Vàng - Tinh Túy Làng Nghề Sa Châu 200 Năm.</p>
        <p className="mt-2">
          Địa chỉ: <a href="https://share.google/E2MS6ylUWEiN940B4" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">
            Làng Sa Châu, Giao Hưng, Ninh Bình, Việt Nam
          </a>
        </p>
      </footer>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#C41E3A' }}>🛒 Giỏ Hàng</h2>

            {cart.length === 0 ? (
              <p className="text-gray-600">Giỏ hàng trống</p>
            ) : (
              <>
                <div className="mb-6 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p style={{ color: '#C41E3A' }} className="font-bold">{(item.price * item.quantity).toLocaleString()}₫</p>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-6 pb-6 border-b">
                  <p style={{ color: '#C41E3A' }} className="text-xl font-bold">
                    Tổng: {getTotalPrice().toLocaleString()}₫
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <input
                    type="text"
                    placeholder="Họ tên"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="email"
                    placeholder="Email (tùy chọn)"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    placeholder="Địa chỉ giao hàng"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleCheckout}
                  style={{ backgroundColor: '#C41E3A' }}
                  className="w-full text-white font-bold py-3"
                  disabled={createOrderMutation.isPending}
                >
                  ✓ Đặt Ngay
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
