# Hướng Dẫn Triển Khai - Nước Mắm Cá Vàng

## 🚀 Khởi Động Dự Án

### 1. Cài Đặt Dependencies
```bash
cd /home/ubuntu/nuocmamcavang-pro
pnpm install
```

### 2. Thiết Lập Biến Môi Trường
Các biến môi trường sau đã được tự động cấu hình bởi Manus:
- `DATABASE_URL`: Kết nối MySQL/TiDB
- `JWT_SECRET`: Secret key cho session
- `VITE_APP_ID`: OAuth app ID
- `OAUTH_SERVER_URL`: OAuth server URL
- `VITE_OAUTH_PORTAL_URL`: OAuth portal URL

### 3. Khởi Tạo Cơ Sở Dữ Liệu

#### Tạo Migration
```bash
pnpm drizzle-kit generate
```

#### Áp Dụng Migration (thông qua Manus UI)
- Mở Manus Management UI
- Vào tab "Database"
- Chạy migration SQL từ `drizzle/` folder

#### Khởi Tạo Admin User & Danh Mục
```bash
node init-admin.mjs
```

Tài khoản admin mặc định:
- **Username**: GOSA
- **Password**: nuocmamcavang123

### 4. Chạy Dev Server
```bash
pnpm dev
```

Server sẽ chạy tại: `http://localhost:3000`

## 📦 Build & Deploy

### Build Production
```bash
pnpm build
```

### Start Production Server
```bash
pnpm start
```

## 🧪 Testing

### Chạy Tất Cả Tests
```bash
pnpm test
```

### Chạy Tests Theo Dõi (Watch Mode)
```bash
pnpm test --watch
```

## 📊 Cấu Trúc Dự Án

```
nuocmamcavang-pro/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Trang chính (Home, About, AdminPanel)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/trpc.ts       # tRPC client setup
│   │   └── App.tsx           # Routes & layout
│   └── public/               # Static files
├── server/                    # Backend Express + tRPC
│   ├── db.ts                 # Database query helpers
│   ├── auth.ts               # Authentication helpers
│   ├── routers.ts            # tRPC procedures
│   └── _core/                # Framework core
├── drizzle/                   # Database schema & migrations
│   └── schema.ts             # Table definitions
├── shared/                    # Shared constants & types
├── storage/                   # S3 storage helpers
├── init-admin.mjs            # Script khởi tạo admin
└── ADMIN_GUIDE.md            # Hướng dẫn Admin Panel
```

## 🔐 Bảo Mật

### Đổi Mật Khẩu Admin
1. Đăng nhập Admin Panel: `/admin`
2. Liên hệ quản trị viên để thay đổi mật khẩu

### Environment Variables
- **Không commit `.env` file** vào git
- Tất cả secrets được quản lý bởi Manus platform

### HTTPS
- Tất cả traffic phải sử dụng HTTPS
- Cookies được set với `secure` flag

## 📧 Email & Zalo Notifications

### Cấu Hình Email
Hiện tại, email notifications cần được tích hợp thêm. Liên hệ quản trị viên để cấu hình:
- SMTP server
- Email template
- Sender address

### Cấu Hình Zalo
Zalo notifications cần được tích hợp thêm. Yêu cầu:
- Zalo Business Account
- API credentials
- Message template

## 📸 Quản Lý Hình Ảnh

### Upload Ảnh Sản Phẩm
```bash
manus-upload-file --webdev path/to/image.jpg
```

Sao chép URL được trả về và dán vào Admin Panel.

### Yêu Cầu Ảnh
- **Định dạng**: JPG, PNG, WebP
- **Kích thước**: Tối đa 5MB
- **Kích cỡ khuyến nghị**: 600x600px hoặc 800x800px

## 🌐 Domains & DNS

### Custom Domain
1. Mở Manus Management UI
2. Vào tab "Settings" → "Domains"
3. Thêm custom domain hoặc mua domain mới
4. Cập nhật DNS records theo hướng dẫn

### Auto-generated Domain
- Manus cung cấp domain tự động: `xxx.manus.space`
- Có thể sử dụng ngay mà không cần cấu hình DNS

## 📊 Analytics & Monitoring

### View Analytics
1. Mở Manus Management UI
2. Vào tab "Dashboard"
3. Xem UV/PV statistics

### Logs
- Dev server logs: `.manus-logs/devserver.log`
- Browser console: `.manus-logs/browserConsole.log`
- Network requests: `.manus-logs/networkRequests.log`

## 🆘 Troubleshooting

### Dev Server Không Khởi Động
```bash
# Kiểm tra port 3000 có bị chiếm không
lsof -i :3000

# Xóa node_modules và cài lại
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Database Connection Error
```bash
# Kiểm tra DATABASE_URL
echo $DATABASE_URL

# Thử kết nối trực tiếp
mysql -u user -p -h host -D database
```

### Build Errors
```bash
# Xóa build cache
rm -rf dist .vite

# Rebuild
pnpm build
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `.manus-logs/`
2. Xem error message chi tiết
3. Liên hệ quản trị viên hệ thống

---

**Cập nhật lần cuối**: 2026-04-22
