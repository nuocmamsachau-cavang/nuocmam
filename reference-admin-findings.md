# Khảo sát trang quản lý tham khảo

Ngày khảo sát: 2026-08-13
Nguồn: https://nemtonghop6.vercel.app

## Phát hiện đã xác nhận

Trang có màn hình đăng nhập riêng với thương hiệu, email, mật khẩu, nút hiện/ẩn mật khẩu và nút đăng nhập.

Sau khi đăng nhập, dashboard dùng layout quản trị với sidebar hẹp bên trái và vùng nội dung chính. Màn hình Tổng quan hiển thị tiêu đề, mô tả dữ liệu, nút đăng xuất và các thẻ KPI. Các KPI quan sát được gồm doanh thu, số đơn hàng, số nệm, số phụ kiện, khách mới và khách cũ.

Phần biểu đồ gồm tăng trưởng doanh thu, số đơn theo tháng, cơ cấu khách mới/cũ, doanh thu theo cửa hàng, sản phẩm theo tháng và sản phẩm theo cửa hàng. Giao diện dùng nền sáng, các thẻ bo góc, màu nhấn xanh/tím/xanh ngọc/cam/hồng, dữ liệu dạng biểu đồ và sidebar có thể thu gọn.

## Hướng chuyển đổi cho Sa Châu

Không sao chép thương hiệu hoặc dữ liệu của hệ thống nệm. Chỉ học cấu trúc UX: dashboard KPI, biểu đồ doanh thu, đơn hàng, sản phẩm bán chạy, khách mới/cũ, bộ lọc thời gian và sidebar quản trị. Dữ liệu cần dùng độc lập từ sản phẩm, đơn hàng, khuyến mãi, blog, đánh giá và nguồn truy cập của Nước Mắm Sa Châu.

## Phạm vi triển khai đề xuất

1. Dashboard tổng quan Sa Châu với KPI doanh thu, đơn hàng, sản phẩm, khách hàng và đánh giá.
2. Biểu đồ doanh thu theo thời gian và đơn hàng theo trạng thái.
3. Bảng sản phẩm bán chạy tính từ đơn hàng không bị hủy.
4. Bộ lọc khoảng thời gian và trạng thái đơn hàng.
5. Sidebar quản trị theo nhận diện đỏ-vàng, responsive mobile.
6. Không tạo đánh giá, doanh thu hoặc đơn hàng giả; chỉ hiển thị dữ liệu có trong database.

## Cấu trúc menu tham khảo

Sau khi mở sidebar, hệ thống tham khảo chia thành Tổng quan; Marketing gồm Quản lý KPI, Công việc, Facebook Ads, Google Ads, Google Maps và Report CH; Bán hàng gồm Báo cáo sale, Cửa hàng, Nhập liệu cửa hàng, Khách hàng và Dự án; cuối cùng là Nhân sự & Tài chính. Với Sa Châu, phiên bản đầu nên tập trung vào Tổng quan, Sản phẩm, Đơn hàng, Khách hàng, Khuyến mãi, Nội dung, Đánh giá và Đo lường quảng cáo; các mục nhân sự/tài chính chỉ thêm khi có yêu cầu và dữ liệu độc lập.
