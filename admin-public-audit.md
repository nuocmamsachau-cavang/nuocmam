# Đối chiếu Admin Panel với website public

Ngày kiểm tra: 2026-08-12.

Trang chủ public đang hiển thị hai khối khuyến mãi cố định: “Khuyến Mãi Đặc Biệt” và “Mua 2 Tặng 1”. Nội dung này nằm trực tiếp trong `Home.tsx` và không lấy từ danh sách `promotions` mà Admin Panel tạo trong database.

Kiểm tra URL `/blog` trả về trang 404, cho thấy Bài Viết hiện chưa có route public.

Kiểm tra `/reviews` trả về 404, xác nhận chưa có route public cho Đánh Giá. Kiểm tra `/product/1` trả “Sản phẩm không tìm thấy” vì ID mẫu không tồn tại trong dữ liệu hiện tại; trong code, ProductDetail có khối SEO ảnh/alt text và thông tin sản phẩm, nhưng không có khối hiển thị reviews hoặc gọi `reviews.getApproved`.
