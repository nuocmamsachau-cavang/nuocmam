import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, MapPin, Phone, Mail } from 'lucide-react';

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
}

export default function OrderConfirmation() {
  const [, setLocation] = useLocation();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    // Lấy dữ liệu đơn hàng từ sessionStorage
    const orderData = sessionStorage.getItem('lastOrder');
    if (orderData) {
      setOrder(JSON.parse(orderData));
      sessionStorage.removeItem('lastOrder');
    } else {
      // Nếu không có dữ liệu, quay về trang chủ
      setLocation('/');
    }
  }, [setLocation]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FEFDFB' }}>
        <div className="text-center">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFDFB' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)' }} className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold hover:opacity-80">🐠 Nước Mắm Cá Vàng</a>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <CheckCircle size={80} style={{ color: '#C41E3A' }} className="mx-auto mb-4" />
          <h1 style={{ color: '#C41E3A' }} className="text-4xl font-bold mb-4">
            ✓ Đơn Hàng Đã Được Tiếp Nhận
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã đặt hàng tại Nước Mắm Cá Vàng!
          </p>
          <p className="text-gray-600">
            Chúng tôi sẽ liên hệ với bạn sớm để xác nhận và giao hàng.
          </p>
        </div>

        {/* Order Details */}
        <Card className="p-8 mb-8">
          <h2 style={{ color: '#C41E3A', borderBottomColor: '#D4AF37' }} className="text-2xl font-bold mb-6 border-b-2 pb-3">
            Chi Tiết Đơn Hàng
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mã Đơn Hàng</p>
              <p style={{ color: '#C41E3A' }} className="font-bold text-lg">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Thời Gian</p>
              <p className="font-bold text-lg">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-8 pb-8 border-b">
            <h3 style={{ color: '#8B1428' }} className="font-bold mb-4 flex items-center gap-2">
              <span>👤 Thông Tin Khách Hàng</span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-gray-600 min-w-fit">Tên:</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-600 mt-0.5" />
                <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-gray-600 mt-0.5" />
                  <a href={`mailto:${order.customerEmail}`} className="text-blue-600 hover:underline">
                    {order.customerEmail}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-600 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8 pb-8 border-b">
            <h3 style={{ color: '#8B1428' }} className="font-bold mb-4">
              📦 Sản Phẩm Đã Đặt
            </h3>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <p style={{ color: '#C41E3A' }} className="font-bold">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: '#FFF8F0' }}>
            <p style={{ color: '#C41E3A' }} className="text-xl font-bold">
              Tổng Tiền:
            </p>
            <p style={{ color: '#C41E3A' }} className="text-2xl font-bold">
              {order.totalAmount.toLocaleString()}₫
            </p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-8 mb-8" style={{ backgroundColor: '#FFF8F0', borderColor: '#D4AF37', borderWidth: 2 }}>
          <h3 style={{ color: '#C41E3A' }} className="font-bold mb-4 text-lg">
            📋 Bước Tiếp Theo
          </h3>
          <ol className="space-y-3 list-decimal list-inside">
            <li className="text-gray-700">
              Chúng tôi sẽ xác nhận đơn hàng qua <strong>SMS/Zalo</strong> trong vòng <strong>2 giờ</strong>
            </li>
            <li className="text-gray-700">
              Bạn sẽ nhận được thông tin chi tiết về <strong>thời gian giao hàng</strong>
            </li>
            <li className="text-gray-700">
              Thanh toán khi nhận hàng (COD) hoặc theo thỏa thuận
            </li>
            <li className="text-gray-700">
              Nếu có thắc mắc, liên hệ: <strong>0867 678 527</strong>
            </li>
          </ol>
        </Card>

        {/* Contact Info */}
        <Card className="p-8 mb-8">
          <h3 style={{ color: '#C41E3A', borderBottomColor: '#D4AF37' }} className="font-bold mb-6 text-lg border-b-2 pb-3">
            📞 Liên Hệ Chúng Tôi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Phone size={32} style={{ color: '#C41E3A' }} className="mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Điện Thoại</p>
              <a href="tel:0867678527" className="text-blue-600 hover:underline font-bold">
                0867 678 527
              </a>
            </div>
            <div className="text-center">
              <Mail size={32} style={{ color: '#C41E3A' }} className="mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Email</p>
              <a href="mailto:nuocmamcavangsachau@gmail.com" className="text-blue-600 hover:underline font-bold">
                nuocmamcavangsachau@gmail.com
              </a>
            </div>
            <div className="text-center">
              <MapPin size={32} style={{ color: '#C41E3A' }} className="mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Địa Chỉ</p>
              <a href="https://share.google/E2MS6ylUWEiN940B4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">
                Sa Châu, Giao Hưng, Ninh Bình
              </a>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <a href="/">
            <Button style={{ backgroundColor: '#D4AF37', color: '#C41E3A' }} className="font-bold px-8 py-3">
              ← Quay Lại Trang Chủ
            </Button>
          </a>
          <a href="/#products">
            <Button style={{ backgroundColor: '#C41E3A' }} className="text-white font-bold px-8 py-3">
              🛍️ Tiếp Tục Mua Sắm
            </Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2C2C2C' }} className="text-white py-8 text-center mt-16">
        <p>&copy; 2026 Nước Mắm Cá Vàng - Tinh Túy Làng Nghề Sa Châu 200 Năm.</p>
      </footer>
    </div>
  );
}
