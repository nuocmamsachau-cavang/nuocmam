# Hướng dẫn triển khai trực tiếp Dashboard quản lý Sa Châu trên Vercel

Tài liệu này hướng dẫn cách đưa **trang quản lý vận hành riêng** (`/operations`) của Nước Mắm Sa Châu lên Vercel thành một project độc lập, tách biệt hoàn toàn với trang bán hàng công khai `gosa.com.vn`.

## Kiến trúc triển khai

- **Nguồn mã:** Sử dụng chung repository GitHub của dự án (nơi đã có sẵn cấu hình `vercel.json` và adapter `api/index.ts`).
- **Project trên Vercel:** Tạo một project riêng (ví dụ đặt tên `sachau-dashboard`) trỏ vào cùng một repository, nhưng được cấu hình để tách biệt giao diện quản trị.
- **Cơ chế hoạt động:** Vercel sẽ tự động build frontend React và dịch vụ Express/tRPC thành Vercel Functions [1]. Khi truy cập `https://ten-dashboard.vercel.app/operations`, hệ thống sẽ yêu cầu đăng nhập quản trị và kết nối trực tiếp với cơ sở dữ liệu thật để hiển thị đơn hàng và chỉ số quảng cáo.

---

## Các bước thực hiện chi tiết trên Vercel

### Bước 1: Tạo Project mới trên Vercel
1. Truy cập [Vercel Dashboard](https://vercel.com/hoangnemtonghop-ship-its-projects) và đăng nhập tài khoản của bạn.
2. Bấm **Add New...** -> **Project**.
3. Chọn repository chứa mã nguồn Nước Mắm Sa Châu (ví dụ `nuocmamsachau-cavang/nuocmam`) và bấm **Import**.

### Bước 2: Cấu hình Build & Output Settings
Tại màn hình **Configure Project**, thiết lập chính xác các thông số sau để Vercel không bị lỗi biên dịch:

| Trường cấu hình | Giá trị chuẩn |
|---|---|
| **Project Name** | `sachau-dashboard` (hoặc tên tùy ý) |
| **Framework Preset** | `Other` (hoặc để trống, không chọn Next.js) |
| **Root Directory** | `./` |
| **Build Command** | `pnpm build` |
| **Output Directory** | `dist/public` |
| **Install Command** | `pnpm install` |

### Bước 3: Khai báo Biến môi trường (Environment Variables)
Trước khi bấm Deploy, mở mục **Environment Variables** và thêm các biến hệ thống quan trọng (chọn áp dụng cho cả `Production` và `Preview`) [2]:

- `DATABASE_URL`: Chuỗi kết nối cơ sở dữ liệu MySQL/TiDB thực tế.
- `JWT_SECRET`: Khóa mã hóa phiên đăng nhập quản trị.
- Các biến hệ thống cốt lõi khác (`BUILT_IN_FORGE_API_KEY`, `VITE_APP_ID`, v.v.) có sẵn trong cấu hình bảo mật của dự án.

> *Lưu ý bảo mật:* Không bao giờ đưa file `.env` chứa mật khẩu database hoặc API key lên nhánh công khai của GitHub.

### Bước 4: Tiến hành Deploy
1. Bấm **Deploy**.
2. Vercel sẽ tiến hành cài đặt thư viện (`pnpm install`), build mã nguồn (`pnpm build`) và phát hành ứng dụng lên một URL tạm thời (ví dụ: `https://sachau-dashboard.vercel.app`).

### Bước 5: Gắn tên miền riêng cho Dashboard
Để truy cập trang quản lý qua một địa chỉ chuyên nghiệp (không dùng chung với trang bán hàng `gosa.com.vn`):
1. Trong project Vercel vừa tạo, vào **Settings** -> **Domains**.
2. Thêm tên miền phụ mong muốn, ví dụ: `quanly.gosa.com.vn` hoặc `dashboard.gosa.com.vn`.
3. Cấu hình bản ghi DNS (CNA/A record) theo hướng dẫn của Vercel tại nhà quản lý tên miền của bạn.
4. Sau khi DNS kích hoạt, bạn có thể truy cập trang quản lý độc lập tại:
   `https://quanly.gosa.com.vn/operations`

---

## Quy trình cập nhật tự động (CI/CD)
Mỗi khi bạn yêu cầu chỉnh sửa tính năng, biểu đồ hoặc module mới cho trang quản lý trong Manus và lưu checkpoint, mã nguồn sẽ tự động đồng bộ lên GitHub. Vercel sẽ nhận diện thay đổi, tự động build lại và cập nhật phiên bản mới nhất lên trang quản lý mà không cần bạn thao tác thủ công.
