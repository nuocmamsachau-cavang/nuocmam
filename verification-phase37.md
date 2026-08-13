# Xác minh Phase 37

## Preview /operations

Route `https://3000-ia7zckkubxutahwa9ppl6-8d78cf6b.sg1.manus.computer/operations` tải thành công với sidebar Sa Châu OS, bốn module Tổng quan, Bán hàng & đơn hàng, Đo lường quảng cáo và Báo cáo & phân tích. Dashboard hiển thị dữ liệu thật từ hệ thống bán hàng sau khi chờ truy vấn hoàn tất: doanh thu `105.000₫`, `1` đơn hàng, `1` khách hàng mới, `28/28` sản phẩm đang hoạt động, `0` đánh giá đã duyệt. Đơn gần đây `ORD-1780360151410` có trạng thái Chờ xử lý.

Khu vực quảng cáo hiển thị rõ trạng thái **Chưa kết nối** cho Google Ads, Facebook Ads và TikTok Ads, không hiển thị số liệu giả. Giao diện responsive desktop tải đúng, sidebar và bộ lọc ngày hoạt động. Preview đang ở chế độ preview nên có thông báo không thể chia sẻ trực tiếp cho đến khi Publish.

## Kết quả kiểm tra kênh

Facebook Page và website gosa.com.vn mở được. Instagram chuyển về màn hình đăng nhập và TikTok không tải nội dung profile trong môi trường kiểm tra, vì vậy chỉ gắn liên kết công khai và không suy đoán số liệu. Link share.google người dùng cung cấp trả về lỗi URL không khả dụng; dashboard dùng link Maps đã xác nhận từ website/Facebook cho đến khi có Place URL chuẩn.

## Bảo vệ truy cập

Route `/operations` hiện có lớp đăng nhập riêng bằng tài khoản quản trị hiện có của Admin Panel; giao diện dashboard không nên mở cho người chưa xác thực. Phiên preview đang giữ token quản trị cũ nên hiển thị dashboard và dữ liệu thật; thao tác kiểm tra nút đăng xuất trong browser preview không chuyển trạng thái ổn định do session preview/HMR, nhưng code đã xóa `adminToken` và `adminUsername` khỏi localStorage trước khi quay lại màn hình login. TypeScript không lỗi sau khi thêm wrapper xác thực.

## Ads backend

Đã tạo migration `drizzle/0006_neat_switch.sql` và áp dụng thành công hai bảng `adCampaigns` và `adMetrics`. Đã thêm helper `getAdCampaignOverview`, `upsertAdCampaign`, `insertAdMetric` và tRPC query `analytics.getAds`; dữ liệu tổng hợp có spend, impressions, clicks, conversions, conversionValue, CTR, CPC, CPM và ROAS theo tổng quan/nền tảng/chiến dịch/ngày. Chưa có bản ghi quảng cáo vì chưa được cấp quyền API và không chèn dữ liệu mẫu.
