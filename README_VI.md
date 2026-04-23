# Nước Mắm Cá Vàng - Website Thương Mại Điện Tử

**Tinh Túy Làng Nghề Sa Châu 200 Năm**

Đây là website bán nước mắm truyền thống được xây dựng bằng React + Express + tRPC + MySQL, với Admin Panel quản lý sản phẩm, SEO, và đơn hàng.

## 🚀 Khởi Động Nhanh

### 1. Cài Đặt Dependencies
```bash
cd /home/ubuntu/nuocmamcavang-pro
pnpm install
```

### 2. Khởi Tạo Database
```bash
# Tạo migration
pnpm drizzle-kit generate

# Áp dụng migration (thông qua Manus UI Database tab)
# Sau đó chạy script seed dữ liệu:
node seed-complete.mjs
```

### 3. Chạy Dev Server
```bash
pnpm dev
```

Server sẽ chạy tại: `http://localhost:3000`

### 4. Truy Cập Admin Panel
- URL: `http://localhost:3000/admin`
- Username: `GOSA`
- Password: `nuocmamcavang123`

## 📊 Tính Năng Chính

### 🏠 Trang Chủ
- Danh mục sản phẩm theo thứ tự: Cá Lục, Cá Mực, Cá Cơm, Mắm Tôm (lên đầu)
- Các nhóm sản phẩm cũ: Cốt Đặc Biệt, Combo & Quà Tặng, Sản Phẩm Khác
- Giỏ hàng với tính năng thêm/xóa sản phẩm
- Video YouTube giới thiệu
- Liên kết mạng xã hội (Facebook, TikTok, Instagram)

### 📋 Trang Về Chúng Tôi
- Nội dung lịch sử 200 năm làng nghề Sa Châu
- Bản đồ Google Maps nhúng trực tiếp
- Thông tin liên hệ

### 🔐 Admin Panel
- **Đăng Nhập**: Bảo vệ bằng mật khẩu
- **Quản Lý Sản Phẩm**: Thêm, sửa, xóa sản phẩm
- **Quản Lý Danh Mục**: Sắp xếp thứ tự hiển thị
- **Quản Lý SEO**: Tối ưu tiêu đề, mô tả, từ khóa
- **Quản Lý Đơn Hàng**: Xem danh sách đơn hàng đã nhận

### 🛒 Giỏ Hàng & Đặt Hàng
- Thêm sản phẩm vào giỏ
- Điền thông tin khách hàng (tên, điện thoại, địa chỉ)
- Xem trang xác nhận đơn hàng chi tiết
- Tích hợp sẵn cho email & Zalo notifications (cần cấu hình)

## 📁 Cấu Trúc Thư Mục

```
nuocmamcavang-pro/
├── client/                      # Frontend React
│   ├── src/
│   │   ├── pages/              # Trang chính
│   │   │   ├── Home.tsx        # Trang chủ
│   │   │   ├── About.tsx       # Trang về chúng tôi
│   │   │   ├── AdminPanel.tsx  # Admin panel
│   │   │   └── OrderConfirmation.tsx  # Xác nhận đơn hàng
│   │   ├── components/         # UI components
│   │   ├── App.tsx             # Routes & layout
│   │   └── index.css           # Global styles
│   └── public/                 # Static files
├── server/                      # Backend Express + tRPC
│   ├── db.ts                   # Database helpers
│   ├── auth.ts                 # Authentication
│   ├── routers.ts              # tRPC procedures
│   └── _core/                  # Framework core
├── drizzle/                     # Database schema
│   ├── schema.ts               # Table definitions
│   └── migrations/             # SQL migrations
├── shared/                      # Shared types
├── seed-complete.mjs           # Script seed dữ liệu
├── init-admin.mjs              # Script khởi tạo admin
├── ADMIN_GUIDE.md              # Hướng dẫn Admin Panel
├── DEPLOYMENT.md               # Hướng dẫn triển khai
└── package.json
```

## 🗄️ Cơ Sở Dữ Liệu

### Bảng Chính
- **users**: Người dùng (từ template gốc)
- **adminUsers**: Tài khoản quản trị
- **categories**: Danh mục sản phẩm (7 danh mục mặc định)
- **products**: Sản phẩm (11 sản phẩm mẫu)
- **orders**: Đơn hàng
- **seoMetadata**: Metadata SEO

### Danh Mục Sản Phẩm (7)
1. Cá Lục (displayOrder: 1)
2. Cá Mực (displayOrder: 2)
3. Cá Cơm (displayOrder: 3)
4. Mắm Tôm (displayOrder: 4)
5. Cốt Đặc Biệt (displayOrder: 5)
6. Combo & Quà Tặng (displayOrder: 6)
7. Sản Phẩm Khác (displayOrder: 7)

## 🧪 Testing

### Chạy Tất Cả Tests
```bash
pnpm test
```

### Kết Quả Hiện Tại
- ✅ Admin Authentication Tests: 9/9 passed
- ✅ Orders Tests: 8/8 passed
- ✅ Auth Logout Tests: 1/1 passed
- **Total: 18/18 tests passed**

## 🔗 Liên Kết Quan Trọng

| Trang | URL |
|-------|-----|
| Trang Chủ | `/` |
| Về Chúng Tôi | `/about` |
| Admin Panel | `/admin` |
| Xác Nhận Đơn Hàng | `/order-confirmation` |
| Facebook | https://www.facebook.com/nuocmamcavanglangsachau/ |
| TikTok | https://www.tiktok.com/@nuocmamcavang |
| Instagram | https://www.instagram.com/nuocmamcavang |
| Google Maps | https://share.google/E2MS6ylUWEiN940B4 |

## 🎨 Thiết Kế

### Màu Sắc
- **Đỏ chính**: #C41E3A
- **Vàng**: #D4AF37
- **Đỏ đậm**: #8B1428
- **Kem**: #FFF8F0

### Font
- Segoe UI, Trebuchet MS, Tahoma

## 📧 Cấu Hình Email & Zalo (Tùy Chọn)

Hiện tại, email và Zalo notifications cần được cấu hình thêm:

### Email
Cần cung cấp:
- SMTP server
- Email sender
- Email password/token

### Zalo
Cần cung cấp:
- Zalo Business Account
- API credentials
- Message template

## 🔒 Bảo Mật

- Tài khoản admin được bảo vệ bằng mật khẩu hash (PBKDF2)
- JWT tokens cho session management
- HTTPS bắt buộc cho production
- Cookies với secure flag

## 📱 Responsive Design

Website được thiết kế responsive cho:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🚀 Triển Khai

### Xây Dựng Production
```bash
pnpm build
```

### Chạy Production Server
```bash
pnpm start
```

## 📞 Hỗ Trợ

### Admin Panel
Xem `ADMIN_GUIDE.md` để biết hướng dẫn chi tiết về quản lý sản phẩm, SEO, và đơn hàng.

### Triển Khai
Xem `DEPLOYMENT.md` để biết hướng dẫn triển khai, cấu hình domain, và troubleshooting.

## 📝 Ghi Chú

- Tất cả dữ liệu sản phẩm được lưu trong database MySQL
- Hình ảnh sản phẩm được lưu trên S3 (thông qua `manus-upload-file --webdev`)
- Admin Panel cho phép quản lý toàn bộ nội dung website mà không cần chỉnh sửa code
- SEO metadata được tối ưu cho từng trang và sản phẩm

## 📄 License

MIT License - Tự do sử dụng cho mục đích thương mại

---

**Cập nhật lần cuối**: 2026-04-23

**Liên hệ**: nuocmamcavangsachau@gmail.com | 0867 678 527
