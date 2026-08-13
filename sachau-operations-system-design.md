# Thiết Kế Hệ Thống Quản Lý Độc Lập & Đo Lường Đa Kênh Cho Nước Mắm Sa Châu

## 1. Mục Tiêu & Định Hướng
Xây dựng một **Hệ Thống Quản Lý Vận Hành Độc Lập (Sa Châu Operating System - SCOS)** riêng biệt, lấy cảm hứng từ cấu trúc dashboard chuyên nghiệp mà bạn đã cung cấp, nhưng được tùy biến hoàn toàn cho ngành hàng **Nước Mắm Truyền Thống Sa Châu**. Hệ thống này không chỉ quản lý đơn hàng, khách hàng và sản phẩm mà còn tích hợp mô hình **Đo Lường Quảng Cáo Đa Kênh (Google Ads, Facebook Ads, TikTok Ads)** nhằm theo dõi chi phí (Spend), lượt nhấp (Clicks), đơn hàng quy đổi (Conversions) và tỷ suất hoàn vốn (ROAS) theo thời gian thực.

---

## 2. Cấu Trúc Phân Module Của Hệ Thống

1. **Tổng Quan (Dashboard):** Hiển thị các chỉ số cốt lõi (Doanh thu thực tế, Tổng chi phí quảng cáo, Lợi nhuận gộp, ROAS tổng, Số lượng đơn hàng, Khách mới/cũ).
2. **Quản Lý Bán Hàng & Đơn Hàng:** Theo dõi chi tiết từng đơn chốt từ landing page, trạng thái giao hàng, sản phẩm bán chạy và phân khúc khách hàng.
3. **Đo Lường Quảng Cáo Đa Kênh (Ads Intelligence):**
   - **Facebook Ads:** Theo dõi chiến dịch, nhóm quảng cáo, chi phí, CPC, CPM, số tin nhắn/đơn hàng sinh ra.
   - **Google Ads:** Theo dõi từ khóa, từ khóa tìm kiếm, chi phí click (CPC) và tỷ lệ chuyển đổi đơn hàng.
   - **TikTok Ads:** Theo dõi chiến dịch video ngắn, lượt xem, CTR và doanh thu quy đổi.
4. **Báo Cáo & Phân Tích (Analytics):** Biểu đồ tăng trưởng doanh thu so với chi phí quảng cáo (Profit vs Ad Spend), cơ cấu khách hàng và hiệu quả từng kênh.

---

## 3. Kiến Trúc Kỹ Thuật & Cơ Sở Dữ Liệu
Hệ thống sẽ được bổ sung các bảng lưu trữ dữ liệu chiến dịch quảng cáo và kết nối trực tiếp với bảng `orders`, `products` hiện có của dự án thông qua cơ sở dữ liệu MySQL và tRPC, đảm bảo tính bảo mật và tốc độ phản hồi nhanh.
