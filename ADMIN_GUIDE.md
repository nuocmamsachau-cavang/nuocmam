# Hướng Dẫn Sử Dụng Admin Panel - Nước Mắm Cá Vàng

## 🔐 Đăng Nhập Admin

1. Truy cập: `https://your-domain.com/admin`
2. Tài khoản mặc định:
   - **Username**: `GOSA`
   - **Password**: `nuocmamcavang123`
3. **⚠️ Quan trọng**: Đổi mật khẩu ngay sau lần đăng nhập đầu tiên

## 📊 Các Tính Năng Admin

### 1. Quản Lý Sản Phẩm

#### Thêm Sản Phẩm Mới
1. Vào tab **"Sản Phẩm"**
2. Điền thông tin:
   - **Danh Mục**: Chọn danh mục (Cá Lục, Cá Mực, Cá Cơm, Mắm Tôm, v.v.)
   - **Tên Sản Phẩm**: Tên hiển thị trên website
   - **Slug**: URL-friendly name (ví dụ: `nuoc-mam-ca-luc-dac-biet`)
   - **Giá**: Giá bán (VNĐ)
   - **Mô Tả**: Mô tả chi tiết sản phẩm
   - **URL Ảnh**: Link ảnh sản phẩm (từ S3 hoặc CDN)
3. Nhấn **"Thêm Sản Phẩm"**

#### Chỉnh Sửa Sản Phẩm
1. Tìm sản phẩm trong danh sách
2. Nhấn nút **"✏️ Sửa"**
3. Cập nhật thông tin
4. Nhấn **"Lưu"**

#### Xóa Sản Phẩm
1. Tìm sản phẩm trong danh sách
2. Nhấn nút **"🗑️ Xóa"**
3. Xác nhận xóa

### 2. Quản Lý Danh Mục

#### Danh Mục Mặc Định
Hệ thống có 7 danh mục mặc định:
1. **Cá Lục** - Nước mắm cá lục đậm đà, béo ngậy
2. **Cá Mực** - Nước mắm cá mực quý hiếm
3. **Cá Cơm** - Nước mắm cá cơm vị ngọt thanh
4. **Mắm Tôm** - Mắm tôm Sa Châu mịn màng
5. **Cốt Đặc Biệt** - Sản phẩm cốt đặc biệt
6. **Combo & Quà Tặng** - Các bộ combo
7. **Sản Phẩm Khác** - Sản phẩm khác

#### Thay Đổi Thứ Tự Hiển Thị
1. Vào tab **"Danh Mục"**
2. Nhấn **"✏️ Sửa"** trên danh mục cần thay đổi
3. Cập nhật **"Thứ tự"** (số nhỏ hơn = hiển thị trước)
4. Nhấn **"Lưu"**

### 3. Quản Lý SEO

#### Tối Ưu SEO Trang Chủ
1. Vào tab **"SEO"**
2. Chọn loại trang: **"home"**
3. Cập nhật:
   - **Tiêu Đề (Title)**: Tối đa 60 ký tự
   - **Mô Tả (Meta Description)**: Tối đa 160 ký tự
   - **Từ Khóa (Keywords)**: Các từ khóa liên quan, cách nhau bằng dấu phẩy
4. Nhấn **"Lưu SEO"**

#### Tối Ưu SEO Sản Phẩm
1. Vào tab **"SEO"**
2. Chọn loại trang: **"product"**
3. Chọn sản phẩm cần tối ưu
4. Cập nhật thông tin SEO
5. Nhấn **"Lưu SEO"**

### 4. Quản Lý Đơn Hàng

1. Vào tab **"Đơn Hàng"**
2. Xem danh sách các đơn hàng đã nhận
3. Thông tin đơn hàng bao gồm:
   - Tên khách hàng
   - Số điện thoại
   - Địa chỉ giao hàng
   - Danh sách sản phẩm
   - Tổng tiền

## 📸 Quản Lý Hình Ảnh Sản Phẩm

### Upload Ảnh
1. Sử dụng công cụ upload: `manus-upload-file --webdev path/to/image.jpg`
2. Copy URL được trả về
3. Dán URL vào trường **"URL Ảnh"** khi thêm/sửa sản phẩm

### Yêu Cầu Ảnh
- **Định dạng**: JPG, PNG, WebP
- **Kích thước**: Tối đa 5MB
- **Kích cỡ khuyến nghị**: 600x600px hoặc 800x800px
- **Tỷ lệ**: Vuông (1:1) hoặc 4:3

## 🔗 Liên Kết Quan Trọng

- **Trang Chủ**: `/`
- **Trang Về Chúng Tôi**: `/about`
- **Admin Panel**: `/admin`
- **Facebook**: https://www.facebook.com/nuocmamcavanglangsachau/
- **TikTok**: https://www.tiktok.com/@nuocmamcavang
- **Instagram**: https://www.instagram.com/nuocmamcavang
- **Google Maps**: https://share.google/E2MS6ylUWEiN940B4

## 📧 Thông Báo Đơn Hàng

Khi khách hàng đặt hàng:
1. Hệ thống sẽ gửi email xác nhận đơn hàng
2. Thông báo Zalo sẽ được gửi tới số điện thoại đã cấu hình
3. Bạn có thể xem chi tiết đơn hàng trong Admin Panel

## 🔒 Bảo Mật

- **Đổi mật khẩu thường xuyên** (ít nhất 3 tháng/lần)
- **Không chia sẻ tài khoản admin** với người khác
- **Đăng xuất** khi không sử dụng
- **Sử dụng HTTPS** để bảo vệ dữ liệu

## ❓ Câu Hỏi Thường Gặp

### Q: Làm sao để thay đổi mật khẩu?
A: Hiện tại, vui lòng liên hệ quản trị viên hệ thống để thay đổi mật khẩu.

### Q: Tôi quên mật khẩu admin?
A: Liên hệ quản trị viên hệ thống để reset mật khẩu.

### Q: Làm sao để xóa sản phẩm vĩnh viễn?
A: Nhấn nút xóa sẽ ẩn sản phẩm (soft delete). Để xóa vĩnh viễn, liên hệ quản trị viên.

### Q: Có thể thay đổi danh mục sản phẩm không?
A: Có, bạn có thể thêm danh mục mới hoặc chỉnh sửa tên danh mục hiện có.

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra kết nối internet
2. Xóa cache trình duyệt (Ctrl+Shift+Delete)
3. Thử đăng nhập lại
4. Liên hệ quản trị viên hệ thống

---

**Cập nhật lần cuối**: 2026-04-22
