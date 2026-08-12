# Phase 33 – Preview verification

- Preview URL: https://3000-ia7zckkubxutahwa9ppl6-8d78cf6b.sg1.manus.computer
- Trang Chủ hiển thị select “Sắp xếp” với các lựa chọn: Mặc định, Giá thấp đến cao, Giá cao đến thấp, Đánh giá cao nhất, Bán chạy nhất.
- Khi chọn “Giá thấp đến cao”, query tải lại danh sách 28 sản phẩm và thứ tự hiển thị bắt đầu từ sản phẩm 95.000₫, sau đó 120.000₫, 160.000₫, 180.000₫, xác nhận sort theo giá hoạt động.
- Giao diện thanh filter vẫn responsive trên preview, gồm từ khóa, giá từ, giá đến, select sort và nút Xóa lọc.
- Preview screenshot sau thao tác sort: `/home/ubuntu/screenshots/3000-ia7zckkubxutahw_2026-08-12_10-57-19_7623.webp`
- Cần tiếp tục kiểm tra Admin Panel; thao tác login demo chỉ dùng khi cần xác minh giao diện quản trị.

Admin Panel `/admin` đã mở được trong preview với phiên đăng nhập hiện có. Tab “Đơn Hàng” hiển thị select “Lọc theo trạng thái đơn hàng” gồm Tất cả trạng thái, Chờ xử lý, Đã xác nhận, Đang giao, Đã giao và Đã hủy. Dữ liệu thật hiện có 1 đơn hàng ở trạng thái “Chờ xử lý”, card hiển thị mã đơn, khách hàng, tổng tiền và badge màu đúng nhận diện.

Khi chọn trạng thái “Đã giao”, Admin Panel gọi lại dữ liệu và hiển thị 0 đơn hàng vì đơn hiện có đang ở trạng thái “Chờ xử lý”. Empty state hiển thị đúng nội dung “Chưa có đơn hàng ở trạng thái Đã giao” cùng nút “Xem tất cả đơn hàng”, xác nhận lọc backend và giao diện không hiển thị nhầm dữ liệu.
