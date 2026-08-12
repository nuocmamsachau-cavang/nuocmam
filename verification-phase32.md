# Phase 32 – Preview verification

- Preview URL: https://3000-ia7zckkubxutahwa9ppl6-8d78cf6b.sg1.manus.computer
- Trang chủ hiển thị thanh “Tìm sản phẩm phù hợp” với trường từ khóa, giá từ, giá đến và nút Xóa lọc.
- Sau khi dữ liệu tải xong, trang chủ hiển thị 28 sản phẩm và các card có nhãn “Chưa có đánh giá” khi chưa có review đã duyệt.
- Card sản phẩm có ảnh, tên, mô tả, giá, nút “+ Thêm” và “Chi Tiết”; ảnh quản trị `/manus-storage/products/1/...jpg` hiển thị ở sản phẩm cá nục.
- Khuyến mãi “Mua 2 Tặng 1” và “Ưu Đãi 20%” hiển thị đúng trên preview.
- Preview screenshot: `/home/ubuntu/screenshots/3000-ia7zckkubxutahw_2026-08-12_10-44-03_9485.webp`
- Cần tiếp tục kiểm tra riêng `/blog`, thao tác lọc/tìm kiếm và trang chi tiết sản phẩm.

## Additional browser checks

Trang `/blog` mở đúng giao diện lọc danh mục và trạng thái rỗng; dữ liệu hiện tại không có bài viết đã xuất bản nên chưa xuất hiện nút phân trang hay danh mục lựa chọn. Đây là trạng thái hợp lệ theo quy tắc public chỉ hiển thị bài đã xuất bản.

Trang `/product/1` tại thời điểm kiểm tra còn ở trạng thái “Đang tải thông tin sản phẩm...”; cần chờ thêm hoặc kiểm tra log/network trước khi kết luận lỗi UI.

Trang `/product/1` sau khi chờ đã tải thành công. Tên sản phẩm hiển thị summary sao 5 biểu tượng rỗng cùng thông báo “Chưa có đánh giá đã duyệt”; khối “Đánh Giá Sản Phẩm” hiển thị “0 đánh giá đã duyệt” và form gửi đánh giá. Ảnh sản phẩm quản trị vẫn hiển thị đúng.

Trang chủ tải lại thành công với 28 sản phẩm và các trường lọc tương tác sẵn sàng.

Tìm kiếm từ khóa “cá nục” trên Trang Chủ đã hoạt động end-to-end: kết quả giảm từ 28 xuống đúng 2 sản phẩm, gồm “Nước Mắm Cá Nục Đặc Biệt 500ml” và “Nước Mắm Cá Nục Thượng Hạng 1L”. Card giữ nguyên ảnh, giá, thao tác giỏ hàng/chi tiết và nhãn rating.

Bộ lọc kết hợp “cá nục” và giá tối thiểu 150.000₫ đã hoạt động chính xác: kết quả còn 1 sản phẩm “Nước Mắm Cá Nục Thượng Hạng 1L” giá 180.000₫; sản phẩm 95.000₫ bị loại đúng theo điều kiện giá.
