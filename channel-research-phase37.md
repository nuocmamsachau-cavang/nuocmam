# Khảo sát kênh và hệ thống tham chiếu Sa Châu

## Hệ thống tham chiếu

Trang quản lý tham khảo `https://nemtonghop6.vercel.app/dashboard` tổ chức sidebar thành Tổng quan; Marketing gồm Quản lý KPI, Công việc, Facebook Ads, Google Ads, Google Maps và Report CH; Bán hàng gồm Báo cáo sale, Cửa hàng, Nhập liệu cửa hàng, Khách hàng và Dự án. Dashboard tổng quan sử dụng các KPI doanh thu, số đơn, sản phẩm, khách mới/cũ; biểu đồ tăng trưởng doanh thu, số đơn theo tháng, cơ cấu khách hàng, doanh thu theo cửa hàng và nhóm sản phẩm theo tháng/cửa hàng.

## Facebook

Trang công khai `https://www.facebook.com/nuocmamcavanglangsachau/` hiển thị tên Nước Mắm Cá Vàng, 33 followers, 237 following, loại Page · Producer, hotline `0867 678 527`, email `gosa@gmail.com`, địa chỉ giới thiệu `Xóm Mỹ Bình, Giao Hưng (Giao Châu), Ninh Bình`, website liên kết `gosa.com.vn`, trạng thái Always open và chưa có đánh giá. Các chỉ số quảng cáo và dữ liệu quản trị không thể lấy đầy đủ từ trang công khai; cần Meta Business/Ads API và quyền quản trị.

## Website

`https://gosa.com.vn/` đang hoạt động với các khu vực Trang Chủ, Sản Phẩm, Về Chúng Tôi, Bài Viết, Liên Hệ; có CTA Khám Phá Sản Phẩm/Mua Ngay, tìm kiếm sản phẩm, lọc giá, sắp xếp, hotline `0867 678 527`, email `nuocmamcavangsachau@gmail.com` và liên kết Google Maps. Đây là nguồn đơn hàng nội bộ có thể kết nối trực tiếp với dashboard thông qua bảng `orders`; sự kiện GA4/Meta/TikTok cần gắn thêm ở các điểm ViewContent, AddToCart, BeginCheckout và Purchase.

## Instagram và TikTok

Instagram URL được chuyển về màn hình đăng nhập; vì vậy không thể xác minh số liệu hồ sơ hoặc nội dung riêng tư bằng truy cập công khai. Trang quản lý nên chỉ hiển thị liên kết tài khoản và trạng thái “chưa kết nối API” cho tới khi có tài khoản Meta/Instagram Business và quyền cần thiết.

TikTok URL mở trang nhưng bản xem trong môi trường kiểm tra không tải được nội dung hồ sơ. Không nên suy đoán follower, lượt xem hoặc doanh thu. Các chỉ số TikTok Ads phải lấy từ TikTok for Business/Marketing API hoặc file xuất báo cáo có xác thực.

## Google Maps và API quảng cáo

Liên kết Google Maps người dùng cung cấp (`https://share.google/8vhVGc4dkHjHPXtiN5`) chuyển tới `https://share.google/error` với thông báo URL không khả dụng trong môi trường kiểm tra. Dashboard nên giữ một ô Google Maps có liên kết địa chỉ công khai hiện đang xác nhận trên website/Facebook, đồng thời cần người dùng gửi lại link Google Maps chuẩn dạng `google.com/maps/...` hoặc Place ID nếu muốn nhúng chính xác.

Tài liệu Google Ads API chính thức xác nhận API hỗ trợ báo cáo từ cấp chiến dịch tới từ khóa, thông qua các truy vấn báo cáo và `GoogleAdsService.Search` hoặc `SearchStream`: https://developers.google.com/google-ads/api/docs/reporting/overview.

Tài liệu Meta Ads Insights chính thức xác nhận cần Meta App và quyền `ads_read`; dữ liệu lấy qua các endpoint insights ở cấp ad account, campaign, ad set hoặc ad, với các trường như impressions, spend, clicks và breakdowns. Nguồn: https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights.

Tài liệu TikTok Marketing API chính thức có các phần Authorization, Reporting, Synchronous/Asynchronous reports, supported dimensions/metrics, Events API và TikTok Click ID. Việc lấy dữ liệu quảng cáo thật cần TikTok for Business developer app, quyền tài khoản và thông tin xác thực. Nguồn: https://business-api.tiktok.com/portal/docs?id=1781891416235009.

## Phân loại dữ liệu

| Nguồn | Có thể hiển thị ngay | Cần quyền/API |
|---|---|---|
| Website gosa.com.vn | URL, sản phẩm, đơn hàng nội bộ, CTA, liên hệ | GA4/Meta/TikTok event stream nếu muốn attribution đầy đủ |
| Facebook Page | URL, tên trang, hotline, email, địa chỉ, follower công khai | Ads spend, campaign, clicks, conversions và Page Insights |
| Instagram | Liên kết tài khoản | Profile/Media Insights và quảng cáo qua Meta Business/Instagram API |
| TikTok | Liên kết tài khoản | TikTok Ads reporting, events và attribution |
| Google Maps | Ô liên kết địa điểm và CTA mở bản đồ | Link/Place ID chuẩn để nhúng chính xác; dữ liệu Business Profile nếu cần quản trị |
