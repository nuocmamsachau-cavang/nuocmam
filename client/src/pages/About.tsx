import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFDFB' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #C41E3A 0%, #8B1428 100%)' }} className="text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold hover:opacity-80">🐠 Nước Mắm Cá Vàng</a>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="hover:opacity-80">Trang Chủ</a>
            <a href="/#products" className="hover:opacity-80">Sản Phẩm</a>
            <a href="/about" className="hover:opacity-80">Về Chúng Tôi</a>
            <a href="/#contact" className="hover:opacity-80">Liên Hệ</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h1 style={{ color: '#C41E3A' }} className="text-4xl font-bold mb-8 text-center">
            Hành Trình 200 Năm Tinh Túy Làng Nghề Sa Châu
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Làng nghề nước mắm Sa Châu (xã Giao Hưng, Giao Thủy, Nam Định) từ lâu đã nổi danh khắp vùng với câu ca: <span style={{ color: '#C41E3A' }} className="font-bold">"Nước mắm Sa Châu, đậm đà vị biển"</span>. Trải qua hơn <span style={{ color: '#C41E3A' }} className="font-bold">hai thế kỷ</span> hình thành và phát triển, nghề làm mắm nơi đây không chỉ là sinh kế mà còn là di sản văn hóa quý báu của cha ông để lại.
            </p>

            <h2 style={{ color: '#8B1428', borderLeftColor: '#D4AF37' }} className="text-2xl font-bold mt-8 mb-4 border-l-4 pl-4">
              Bí Quyết "Nắng Gió Và Thời Gian"
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Điều làm nên sự khác biệt của Nước Mắm Cá Vàng chính là phương pháp ủ chượp truyền thống "rút nỏ". Chúng tôi không sử dụng bất kỳ hóa chất hay máy móc can thiệp vào quá trình lên men. Cá tươi sau khi đánh bắt về được trộn với muối biển tinh khiết theo tỉ lệ 4 cá : 1 muối, sau đó được đưa vào các chum sành lớn.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Quá trình ủ chượp kéo dài từ <span style={{ color: '#C41E3A' }} className="font-bold">12 đến 24 tháng</span> dưới nắng gió khắc nghiệt của vùng biển Giao Thủy. Hàng ngày, những nghệ nhân làm mắm phải đánh đảo, phơi nắng để mắm chín đều, tạo ra dòng nước mắm chắt có màu cánh gián sóng sánh như mật ong và vị ngọt hậu sâu sắc.
            </p>

            <h2 style={{ color: '#8B1428', borderLeftColor: '#D4AF37' }} className="text-2xl font-bold mt-8 mb-4 border-l-4 pl-4">
              Đa Dạng Tinh Túy Từ Biển Cả
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Kế thừa tinh hoa làng nghề, Nước Mắm Cá Vàng mang đến cho thực khách những dòng sản phẩm đặc trưng:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="text-lg">
                <span style={{ color: '#C41E3A' }} className="font-bold">Nước mắm Cá Lục:</span> Đậm đà, béo ngậy, là dòng mắm truyền thống lâu đời nhất.
              </li>
              <li className="text-lg">
                <span style={{ color: '#C41E3A' }} className="font-bold">Nước mắm Cá Mực:</span> Quý hiếm, hương vị độc đáo, sánh đặc và cực kỳ bổ dưỡng.
              </li>
              <li className="text-lg">
                <span style={{ color: '#C41E3A' }} className="font-bold">Nước mắm Cá Cơm:</span> Vị ngọt thanh, hương thơm dịu nhẹ, phù hợp cho mọi bữa cơm gia đình.
              </li>
              <li className="text-lg">
                <span style={{ color: '#C41E3A' }} className="font-bold">Mắm Tôm Sa Châu:</span> Mịn màng, thơm nồng, được xay thủ công và ủ chín tự nhiên.
              </li>
            </ul>

            <h2 style={{ color: '#8B1428', borderLeftColor: '#D4AF37' }} className="text-2xl font-bold mt-8 mb-4 border-l-4 pl-4">
              Cam Kết Chất Lượng
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Mỗi chai nước mắm Cá Vàng là sự cam kết của chúng tôi về chất lượng, truyền thống và tâm huyết. Chúng tôi chỉ sử dụng cá tươi đánh bắt tại vùng biển địa phương, muối biển tinh khiết, và không thêm bất kỳ chất bảo quản hay hóa chất nào. Sản phẩm của chúng tôi là sự kết tinh của 200 năm kinh nghiệm làm mắm của làng Sa Châu.
            </p>
          </div>

          {/* Map Section */}
          <div className="mt-12 pt-12 border-t-2" style={{ borderTopColor: '#D4AF37' }}>
            <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-6 text-center">
              📍 Ghé Thăm Làng Nghề Sa Châu
            </h2>
            <div className="rounded-lg overflow-hidden shadow-lg mb-6" style={{ height: '400px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3743.8322624536!2d106.3533827!3d20.2253457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313603002f974633%3A0x7f4802f06894982!2zTsaw4bubYyBN4bqvbSBDw6EgVsOgbmc!5e0!3m2!1svi!2s!4v1713678000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="text-center">
              <a
                href="https://share.google/E2MS6ylUWEiN940B4"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#C41E3A' }}
                className="font-bold text-lg hover:underline"
              >
                Mở trong Google Maps ↗
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-12 border-t-2" style={{ borderTopColor: '#D4AF37' }}>
            <h2 style={{ color: '#C41E3A' }} className="text-2xl font-bold mb-8 text-center">
              Liên Hệ Với Chúng Tôi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Phone size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
                <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2 text-lg">Điện Thoại</h3>
                <a href="tel:0867678527" className="text-blue-600 hover:underline">0867 678 527</a>
              </div>
              <div className="text-center">
                <Mail size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
                <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2 text-lg">Email</h3>
                <a href="mailto:nuocmamcavangsachau@gmail.com" className="text-blue-600 hover:underline">nuocmamcavangsachau@gmail.com</a>
              </div>
              <div className="text-center">
                <MapPin size={40} style={{ color: '#C41E3A' }} className="mx-auto mb-3" />
                <h3 style={{ color: '#C41E3A' }} className="font-bold mb-2 text-lg">Địa Chỉ</h3>
                <a href="https://share.google/E2MS6ylUWEiN940B4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Làng Sa Châu, Giao Hưng, Ninh Bình
                </a>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12 text-center">
            <a href="/">
              <Button style={{ backgroundColor: '#D4AF37', color: '#C41E3A' }} className="font-bold px-8 py-3">
                ← Quay Lại Trang Chủ
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2C2C2C' }} className="text-white py-8 text-center mt-16">
        <p>&copy; 2026 Nước Mắm Cá Vàng - Tinh Túy Làng Nghề Sa Châu 200 Năm.</p>
      </footer>
    </div>
  );
}
