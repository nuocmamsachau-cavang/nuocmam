# Đánh giá triển khai dashboard Sa Châu trên Vercel

## Tình trạng truy cập

URL workspace người dùng cung cấp (`https://vercel.com/hoangnemtonghop-ship-its-projects`) hiện chuyển về trang đăng nhập Vercel. Chưa thể xác định project, repository, domain hoặc biến môi trường cụ thể khi chưa có phiên đăng nhập.

## Tương thích kỹ thuật

Vercel có tài liệu chính thức cho phép triển khai ứng dụng Express hiện có mà không cần cấu hình đặc biệt. Khi triển khai, Express trở thành một Vercel Function; tài liệu yêu cầu export app mặc định hoặc dùng listener phù hợp. Static assets phải đặt trong `public/**`; `express.static()` không được dùng để phục vụ asset trên Vercel.

Ứng dụng Sa Châu hiện dùng Express + tRPC + Drizzle/MySQL. Về nguyên tắc có thể chạy trên Vercel, nhưng cần kiểm tra entrypoint `server/_core/index.ts`, routing `/api/trpc`, asset path, upload/storage và connection lifecycle trước khi deploy. Vercel khuyến nghị pool kết nối database ở global scope và dùng `attachDatabasePool` khi chạy Functions/Fluid Compute; không nên mở kết nối mới cho mỗi request.

Biến môi trường Vercel được mã hóa khi lưu và có phạm vi Development, Preview, Production. Thay đổi biến môi trường chỉ áp dụng cho deployment mới. Không được đưa `DATABASE_URL`, `JWT_SECRET`, OAuth secret, storage key hoặc Ads API token vào GitHub/source code.

## Kết luận tạm thời

Có thể chuẩn bị bản Vercel-compatible từ mã nguồn hiện tại. Tuy nhiên chưa nên liên kết hoặc deploy vào project người dùng trước khi xác định đúng project/repository và có bản sao database/storage. Cần người dùng đăng nhập Vercel trong browser hoặc cung cấp project/repository đích; không cần gửi mật khẩu qua chat.

## Nguồn chính thức

1. Vercel, “Express on Vercel”: https://vercel.com/docs/frameworks/backend/express
2. Vercel, “Environment variables”: https://vercel.com/docs/environment-variables
3. Vercel, “Connection Pooling with Vercel Functions”: https://vercel.com/kb/guide/connection-pooling-with-functions
