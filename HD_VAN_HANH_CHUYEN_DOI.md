# Hướng Dẫn Vận Hành Hệ Thống Nước Mắm Cá Vàng (www.gosa.com.vn)

Tài liệu này tổng hợp quy trình quản lý sản phẩm, tải ảnh chuẩn SEO và tự động hóa cập nhật lên website chính thức.

## 1. Quản lý sản phẩm và tải ảnh (Admin Panel)
- **Truy cập trang quản trị**: Đăng nhập vào trang Admin của dự án.
- **Tải ảnh sản phẩm**: Mỗi sản phẩm hỗ trợ tối đa **3 ảnh** (chuẩn SEO Google). Khi bạn tải ảnh lên trong tab sản phẩm, hệ thống sẽ tự động lưu trữ an toàn trên đám mây S3 và ghi nhận vào cơ sở dữ liệu.
- **Cập nhật thông tin**: Có thể chỉnh sửa tên, giá, danh mục, mô tả và thứ tự hiển thị ảnh ngay lập tức.

## 2. Cơ chế tự động hóa cập nhật website
- Khi hệ thống backend ghi nhận thao tác tải ảnh hoặc cập nhật sản phẩm thành công, hệ thống sẽ gửi tín hiệu (`repository_dispatch`) đến kho lưu trữ GitHub chứa mã nguồn website.
- **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) sẽ tự động kích hoạt quá trình biên dịch (`build`) và đồng bộ hóa giao diện lên tên miền chính thức `www.gosa.com.vn`.

## 3. Lưu ý quan trọng về Bảo Mật
- Không lưu trữ các khóa bí mật (GitHub Personal Access Token) trong giao diện Manus vì hệ thống không hỗ trợ ô lưu trữ secrets độc lập. Thay vào đó, token được bảo mật an toàn trực tiếp trong **GitHub Repository Secrets**.
- Mọi bài kiểm tra tự động (Vitest) đều đạt 100% (56/56 tests passing), đảm bảo mã nguồn ổn định và không có lỗi xung đột.
